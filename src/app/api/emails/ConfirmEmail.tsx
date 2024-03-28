import { Button, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailWrapper } from "./shared";
import { User } from "lucia";

interface ConfirmEmailProps {
  user: User;
  url: string;
}

export const ConfirmEmail = ({ user, url }: ConfirmEmailProps) => {
  return (
    <EmailWrapper
      user={user}
      preview="Confirm Email Address"
      heading="Confirm Email Address"
    >
      <Text className="text-black text-[14px] leading-[24px]">
        Hey <b>{user.first_name}</b>, thank you for registering an account with
        the UBC Tennis Circle. Please click the button below to confirm your
        email address.
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-[#15997e] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4"
          href={url}
        >
          Confirm email
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

export default ConfirmEmail;
