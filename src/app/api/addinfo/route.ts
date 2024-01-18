import {ServerResponse} from '@helpers/serverResponse';
import {connectToDatabase} from '@lib/mongoose';
import {logger} from '@lib/winston';
import {User} from '@models/User';
import {NextRequest} from 'next/server';
import z from 'zod';

const UpdateSchema = z.object({
  id: z.string({required_error: 'User ID is required'}),
  skill: z.number({required_error: 'Skill level is required'}).refine(
    (skillValue: number) => {
      const LESS_THAN_MAX = skillValue <= 5;
      const MORE_THAN_MIN = skillValue >= 1;
      return LESS_THAN_MAX && MORE_THAN_MIN;
    },
    {message: 'Skill level must be between 1 and 5'}
  ),
  instagram: z.string({required_error: 'Instagram is required'}),
});

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const validation = UpdateSchema.safeParse(body);

  if (validation.success) {
    try {
      const {id, skill, instagram} = structuredClone(body);

      const user = await User.findById(id);

      if (!user) {
        return ServerResponse.userError('Invalid user ID');
      }

      const updatedUser = await User.findByIdAndUpdate(id, {
        skill: skill,
        instagram: instagram,
      });

      return ServerResponse.success(updatedUser);
    } catch (e) {
      logger.error(e);
      console.log(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
