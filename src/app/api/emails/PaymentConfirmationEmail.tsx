import { Text } from "@react-email/components";
import * as React from "react";
import { EmailWrapper } from "./shared";
import { User } from "lucia";

interface PaymentConfirmationEmail {
  user: User;
  eventName: string;
}

export const PaymentConfirmationEmail = ({
  user,
  eventName,
}: PaymentConfirmationEmail) => {
  return (
    <EmailWrapper
      user={user}
      preview={`Payment Confirmation for ${eventName}`}
      heading={`Payment Confirmation for ${eventName}`}
    >
      <Text className="text-black text-[14px] leading-[24px]">
        Hey <b>{user.first_name}</b>, this is payment confirmation for your
        purchase for {eventName}.
      </Text>
    </EmailWrapper>
  );
};

export default PaymentConfirmationEmail;
