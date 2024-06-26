import { User } from "@models";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@lib/mongoose";
import z from "zod";
import { ServerResponse } from "@helpers/serverResponse";
import ResetPasswordEmail from "@emails/ResetPasswordEmail";
import { logger, sendMail } from "@lib";
import { generatePasswordResetToken } from "@helpers/generateToken";

const emailSchema = z.object({
  email_address: z.string().email(),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const validation = emailSchema.safeParse(body);

  if (validation.success) {
    const user = await User.findOne({
      email_address: body.email_address,
    }).lean<User>();

    if (!user) {
      return ServerResponse.userError(
        "There is no account associated with this email",
      );
    }

    if (user.provider === "google") {
      return ServerResponse.userError(
        "Cannot reset password for a Google account",
      );
    }

    try {
      const token = await generatePasswordResetToken(user._id);
      const url = `${process.env.NEXT_PUBLIC_HOSTNAME}/password-reset/${token}`;

      await sendMail({
        to: body.email_address,
        subject: "Reset your password",
        emailComponent: ResetPasswordEmail({
          user,
          url: url,
        }),
      });
      return ServerResponse.success("Password reset link sent to inbox");
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError("An unexpected error occurred");
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
