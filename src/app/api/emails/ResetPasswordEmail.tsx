import { User } from "@models";
import { Button, Link, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./shared";
import * as React from "react";

interface ResetPasswordEmailProps {
  user: User;
  url: string;
}

export const ResetPasswordEmail = ({ user, url }: ResetPasswordEmailProps) => {
  return (
    <EmailWrapper
      preview="Reset your password"
      heading="Reset your password"
      user={user}
    >
      <Text className="text-black text-[14px] leading-[24px]">
        Hey <b>{user?.first_name}</b>, forgot your password? We received a
        request to reset the password for your account. To reset your password,
        click on the button below.
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-[#15997e] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4"
          href={url}
        >
          Reset Password
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

export default ResetPasswordEmail;
