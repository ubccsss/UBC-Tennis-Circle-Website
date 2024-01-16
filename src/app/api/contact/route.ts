import {NextRequest} from 'next/server';
import {z} from 'zod';
import {connectToDatabase} from '@lib';
import {logger, sendMail} from '@lib';
import {ServerResponse} from '@helpers';
import ContactEmail from '@emails/ContactEmail';

const ContactEmailSchema = z.object({
  name: z.string({required_error: 'Username is required'}),
  email_address: z
    .string({required_error: 'Email Address is required'})
    .email(),
  message: z.string({required_error: 'Message is required'}),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const {name, email_address, message} = structuredClone(body);
  const validation = ContactEmailSchema.safeParse({
    name,
    email_address,
    message,
  });

  if (validation.success) {
    try {
      const subject = `Email from ${name}`;
      await sendMail({
        to: `${process.env.NEXT_CONTACT_EMAIL}`,
        subject: subject,
        emailComponent: ContactEmail({
          name,
          email_address,
          message,
        }),
      });

      return ServerResponse.success('Successfully sent message.');
    } catch (e) {
      logger.error(e);

      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
