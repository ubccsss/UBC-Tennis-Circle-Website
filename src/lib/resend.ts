"use server";
import React from "react";
import { Resend } from "resend";
import { renderAsync } from "@react-email/render";
import { logger } from "./winston";
import { ServerResponse } from "@helpers";

const resend = new Resend(process.env.NEXT_RESEND_API);

interface SendMailProps {
  to: string | string[];
  subject: string;
  emailComponent: React.ReactElement;
}

interface BatchMailProps {
  emailArray: Array<SendMailProps>;
}

export const sendMail = async ({
  to,
  subject,
  emailComponent,
}: SendMailProps) => {
  try {
    const emailHTML = await renderAsync(emailComponent);

    return await resend.emails.send({
      from: `UBC Tennis Circle <${process.env.NEXT_SEND_EMAIL!}>`,
      to,
      subject,
      html: emailHTML,
    });
  } catch (e: unknown) {
    logger.error(e);
    return ServerResponse.serverError(
      "We are currently experiencing a problem with our email server.",
    );
  }
};

export const batchMail = async ({ emailArray }: BatchMailProps) => {
  try {
    // avoid batch limit
    if (emailArray.length >= 95) {
      const half = Math.ceil(emailArray.length / 2);
      await batchMail({ emailArray: emailArray.slice(0, half) });
      await batchMail({ emailArray: emailArray.slice(half) });
    }
    const convertedEmailArray = await Promise.all(
      emailArray.map(async (i) => ({
        ...i,
        html: await renderAsync(i.emailComponent),
        from: `UBC Tennis Circle <${process.env.NEXT_SEND_EMAIL!}>`,
      })),
    );

    return await resend.batch.send(convertedEmailArray);
  } catch (e: unknown) {
    logger.error(e);
    return ServerResponse.serverError(
      "We are currently experiencing a problem with our email server.",
    );
  }
};
