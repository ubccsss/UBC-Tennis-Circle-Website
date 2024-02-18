import {getSession} from '@helpers/getSession';
import {ServerResponse} from '@helpers/serverResponse';
import {auth} from '@lib/lucia';
import {connectToDatabase} from '@lib/mongoose';
import {DeletedUser} from '@models/User';
import {NextRequest} from 'next/server';

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const user = session.user;

  try {
    const userId = user.userId;

    await DeletedUser.create({
      _id: userId,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      email_verified: user.email_verified,
      skill: user.skill,
      instagram: user.instagram,
      profile: user.profile,
      provider: user.provider,
    });

    await auth.deleteUser(userId);

    return ServerResponse.success('Successfully deleted account');
  } catch (e) {
    return ServerResponse.serverError();
  }
};
