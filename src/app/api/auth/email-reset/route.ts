import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import z from 'zod';
import {ServerResponse, getSession} from '@helpers';
import ResetEmail from '@emails/ResetEmail';
import {logger, sendMail} from '@lib';
import {generateEmailResetToken} from '@helpers/generateEmailToken';

const emailSchema = z.object({
  email_address: z.string().email(),
  password: z.string(),
});

type Email = z.infer<typeof emailSchema>;

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: Email = await request.json();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const OLD_EMAIL = session.user.email_address;
  const NEW_EMAIL = body.email_address;

  const validation = emailSchema.safeParse(body);
  if (validation.success) {
    try {
      const token = await generateEmailResetToken(
        session.user.userId,
        NEW_EMAIL
      );
      const url = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/email-reset/callback?token=${token}`;

      await sendMail({
        to: NEW_EMAIL,
        subject: 'Reset your email',
        emailComponent: ResetEmail({
          first_name: session.user.first_name,
          last_name: session.user.last_name,
          url: url,
          old_email: OLD_EMAIL,
        }),
      });
      return ServerResponse.success('Confirmation link has been sent to inbox');
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError('An unexpected error occurred');
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
