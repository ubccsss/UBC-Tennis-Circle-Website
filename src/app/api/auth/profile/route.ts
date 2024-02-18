import {getSession} from '@helpers/getSession';
import {ServerResponse} from '@helpers/serverResponse';
import {connectToDatabase} from '@lib/mongoose';
import {User} from '@models/User';
import {NextRequest} from 'next/server';
import z from 'zod';

const updateProfileSchema = z.object({
  first_name: z.string({required_error: 'First name is required'}),
  last_name: z.string({required_error: 'Last name is required'}),
  skill: z.number({required_error: 'Skill level is required'}).refine(
    (skillValue: number) => {
      const LESS_THAN_MAX = skillValue <= 5;
      const MORE_THAN_MIN = skillValue >= 1;
      return LESS_THAN_MAX && MORE_THAN_MIN;
    },
    {message: 'Skill level must be between 1 and 5'}
  ),
  instagram: z.string({required_error: 'Instagram is required'}),
  profile: z.string({required_error: 'Profile is required'}),
});

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const {first_name, last_name, skill, instagram, profile} =
    structuredClone(body);

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const userId = session.user.userId;

  const validation = updateProfileSchema.safeParse({
    first_name,
    last_name,
    skill,
    instagram,
    profile,
  });

  if (validation.success) {
    try {
      await User.findByIdAndUpdate(userId, {
        first_name,
        last_name,
        skill,
        instagram,
        profile,
      });

      return ServerResponse.success('Successfully updated user attributes');
    } catch (e) {
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
