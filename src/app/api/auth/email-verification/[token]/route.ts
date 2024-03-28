import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { connectToDatabase, logger } from "@lib";
import { User } from "@models";
import { auth } from "@lib";
import { cookies, headers } from "next/headers";

export const GET = async (
  request: NextRequest,
  { params: { token } }: { params: { token: string } },
) => {
  await connectToDatabase();

  let success = false;
  let id: string;

  try {
    const user = await User.findOne({
      "email_verification_token.id": token,
    }).lean<User>();
    if (user) {
      id = user._id;
      await User.updateOne(
        { "email_verification_token.id": token },
        {
          $set: { email_verified: true },
          $unset: { email_verification_token: 1 },
        },
      );

      const userAttributes = {
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        email_verified: user.email_verified,
        skill: user.skill,
        instagram: user.instagram,
        profile: user.profile,
        provider: "password",
      };

      const session = await auth.createSession({
        userId: id,
        attributes: userAttributes,
      });

      const authRequest = auth.handleRequest(request.method, {
        cookies,
        headers,
      });

      authRequest.setSession(session);
      success = true;
    }
  } catch (e) {
    logger.error(e);
  }

  if (success) {
    redirect("/profile/setup");
  } else {
    redirect("/login?confirmation-status=failed");
  }
};
