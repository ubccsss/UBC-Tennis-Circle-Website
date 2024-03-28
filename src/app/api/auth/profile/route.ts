import { connectToDatabase } from "@lib/mongoose";
import { User } from "@models/User";
import { NextRequest } from "next/server";
import z from "zod";
import { dataURLtoFile, ServerResponse, getSession } from "@helpers";
import { UTApi } from "uploadthing/server";

const updateProfileSchema = z.object({
  first_name: z.string({ required_error: "First name is required" }),
  last_name: z.string({ required_error: "Last name is required" }),
  skill: z.number().int().max(4).min(1).optional(),
  instagram: z
    .literal("")
    .or(
      z
        .string()
        .regex(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
          "Invalid Instagram Username",
        ),
    ),
  profile: z.string({ required_error: "Profile is required" }),
});

const base64ImageType = (dataStr: string) => {
  return dataStr.match(/^data:(.+);base64/)?.[1];
};
const isBase64Image = (input: string): boolean => {
  return base64ImageType(input)?.split("/")[0] === "image";
};

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const { first_name, last_name, skill, instagram, profile } =
    structuredClone(body);

  const { session } = await getSession(request);

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
          imageType,
        );

        // bytes -> kb -> mb is greater than 2mb
        if (file.size > 1024 ** 2 * 2) {
          return ServerResponse.serverError("User image is too big");
        }

        const uploadRes = await utapi.uploadFiles([file]);

        if (uploadRes[0].error) {
          return ServerResponse.serverError("Could not process User image");
        }

        pfpUrl = uploadRes[0].data.url;
      }

      await User.findByIdAndUpdate(userId, {
        first_name,
        last_name,
        skill: skill || 1,
        instagram,
        profile: pfpUrl,
      });

      return ServerResponse.success("Successfully updated user attributes");
    } catch (e) {
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
