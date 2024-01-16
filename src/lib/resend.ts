import React from 'react';
import {Resend} from 'resend';
import {renderAsync} from '@react-email/render';
import {logger} from './winston';
import {ServerResponse} from '@helpers';

const resend = new Resend(process.env.NEXT_RESEND_API);

interface SendMailProps {
  to: string;
  subject: string;
  emailComponent: React.ReactElement;
}

export const sendMail = async ({
  to,
  subject,
  emailComponent,
}: SendMailProps) => {
  try {
    const emailHTML = await renderAsync(emailComponent);

    return await resend.emails.send({
      from: process.env.NEXT_SEND_EMAIL!,
      to,
      subject,
      html: emailHTML,
    });
  } catch (e: unknown) {
    logger.error(e);
    return ServerResponse.serverError(
      'We are currently experiencing a problem with our email server.'
    );
  }
};
