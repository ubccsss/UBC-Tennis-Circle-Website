import { Button, Link, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./shared";
import * as React from "react";
import { User } from "lucia";

interface ResetEmailProps {
  user: User;
  url: string;
}

export const ResetEmail = ({ url, user }: ResetEmailProps) => {
  return (
    <EmailWrapper
      preview="Reset your email"
      heading="Reset your email"
      user={user}
    >
      <Text className="text-black text-[14px] leading-[24px]">
        Hey <b>{user.first_name}</b>, trying to reset your email? We received a
        request to reset your account email from <b>{user.old_email}</b> to this
        email. To change your account email to this email, click on the button
        below.
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-[#15997e] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4"
          href={url}
        >
          Reset email
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        or copy and paste this URL into your browser:{" "}
        <Link href={url} className="text-blue-600 no-underline">
          {url}
        </Link>
      </Text>
    </EmailWrapper>
  );
};

export default ResetEmail;
