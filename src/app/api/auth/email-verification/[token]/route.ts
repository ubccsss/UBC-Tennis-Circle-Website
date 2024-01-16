import {NextRequest} from 'next/server';
import {redirect} from 'next/navigation';
import {connectToDatabase, logger} from '@lib';
import {User} from '@models';

export const GET = async (
  _: NextRequest,
  {params: {token}}: {params: {token: string}}
) => {
  await connectToDatabase();

  let success = false;

  try {
    const user = await User.findOne({
      'email_verification_token.id': token,
    }).lean<User>();
    if (user) {
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
    redirect('/login?confirmation-status=true');
  } else {
    redirect('/login?confirmation-status=failed');
  }
};
