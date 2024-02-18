import {ServerResponse} from '@helpers/serverResponse';
import {connectToDatabase} from '@lib/mongoose';
import {logger} from '@lib/winston';
import {User} from '@models/User';
import {NextRequest} from 'next/server';
import z from 'zod';
import {UTApi} from 'uploadthing/server';
import {dataURLtoFile} from '@helpers/dataURLtoFile';

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
  profile: z.string({required_error: 'Profile is required'}),
});

const testIfBase64 = (input: string): boolean => {
  return input.startsWith('https://');
};

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const validation = UpdateSchema.safeParse(body);

  if (validation.success) {
    try {
      const {id, skill, instagram, profile} = structuredClone(body);

      const base64ImageType = profile.match(/^data:(.+);base64/)?.[1];

      let profileURL = profile;

      if (!testIfBase64(profileURL)) {
        if (base64ImageType?.split('/')[0] !== 'image' && !profileURL) {
          return ServerResponse.userError('Invalid company image');
        }

        if (base64ImageType?.split('/')[0] === 'image') {
          // uploading image to uploadthing if base64
          const utapi = new UTApi({
            apiKey: process.env.NEXT_UPLOADTHING_SECRET,
          });

          const file = await dataURLtoFile(profile, instagram, base64ImageType);

          // bytes -> kb -> mb is greater than 2mb
          if (file.size > 1024 ** 2 * 2) {
            return ServerResponse.serverError('User image is too big');
          }

          const uploadRes = await utapi.uploadFiles([file]);

          if (uploadRes[0].error) {
            return ServerResponse.serverError('Could not process User image');
          }

          profileURL = uploadRes[0].data.url;
        }
      }

      const user = await User.findById(id);

      if (!user) {
        return ServerResponse.userError('Invalid user ID');
      }

      await User.findByIdAndUpdate(id, {
        skill: skill,
        instagram: instagram,
        profile: profileURL,
      });

      return ServerResponse.success('Successfully updated user attributes');
    } catch (e) {
      logger.error(e);
      console.log(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
