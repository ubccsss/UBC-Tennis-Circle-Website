import {NextRequest} from 'next/server';
import {redirect} from 'next/navigation';
import {connectToDatabase, logger} from '@lib';
import {User} from '@models';
import {auth} from '@lib';
import {cookies, headers} from 'next/headers';

export const GET = async (
  _: NextRequest,
  {params: {token}}: {params: {token: string}}
) => {
  await connectToDatabase();

  let success = false;
  let id;
  let profile;

  try {
    const user = await User.findOne({
      'email_verification_token.id': token,
    }).lean<User>();
    if (user) {
      id = user._id;
      profile = user.profile;
      await User.updateOne(
        {'email_verification_token.id': token},
        {
          $set: {email_verified: true},
          $unset: {email_verification_token: 1},
        }
      );

      success = true;
    }
  } catch (e) {
    logger.error(e);
  }

  if (success) {
    redirect(`/signup/addinfo?id=${id}&picture=${profile}`);
  } else {
    redirect('/login?confirmation-status=failed');
  }
};
