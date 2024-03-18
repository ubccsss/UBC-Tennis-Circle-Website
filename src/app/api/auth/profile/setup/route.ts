import {getSession} from '@helpers/getSession';
import {ServerResponse} from '@helpers/serverResponse';
import {connectToDatabase} from '@lib/mongoose';
import {logger} from '@lib/winston';
import {User} from '@models/User';
import {NextRequest} from 'next/server';
import z from 'zod';
import {UTApi} from 'uploadthing/server';
import {dataURLtoFile} from '@helpers/dataURLtoFile';

const setupSchema = z.object({
  skill: z.number().int().max(4).min(1).optional(),
  instagram: z.string().optional(),
  profile: z.string({required_error: 'Profile is required'}),
});

const base64ImageType = (dataStr: string) => {
  return dataStr.match(/^data:(.+);base64/)?.[1];
};
const isBase64Image = (input: string): boolean => {
  return base64ImageType(input)?.split('/')[0] === 'image';
};

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body: z.infer<typeof setupSchema> = await request.json();

  const validation = setupSchema.safeParse(body);

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  if (validation.success) {
    try {
      const {skill, instagram, profile} = body;

      let pfpUrl = profile;

      const imageType = base64ImageType(profile);

      if (profile && isBase64Image(profile) && imageType) {
        // uploading image to uploadthing if base64
        const utapi = new UTApi({
          apiKey: process.env.NEXT_UPLOADTHING_SECRET,
        });

        const file = await dataURLtoFile(
          profile,
          session.user.userId,
          imageType
        );

        // bytes -> kb -> mb is greater than 2mb
        if (file.size > 1024 ** 2 * 2) {
          return ServerResponse.serverError('User image is too big');
        }

        const uploadRes = await utapi.uploadFiles([file]);

        if (uploadRes[0].error) {
          return ServerResponse.serverError('Could not process User image');
        }

        pfpUrl = uploadRes[0].data.url;
      }

      await User.findByIdAndUpdate(session.user.userId, {
        skill: skill || 1,
        instagram: instagram,
        profile: pfpUrl,
      });

      return ServerResponse.success('Successfully updated user attributes');
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
