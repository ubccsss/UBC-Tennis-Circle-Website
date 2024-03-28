import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
  Img,
} from "@react-email/components";
import { User } from "@models";
import * as React from "react";

interface EmailWrapperProps {
  children: React.ReactNode;
  preview: string;
  heading: string;
  user:
  | {
    first_name: string;
    last_name: string;
    [key: string]: unknown;
  }
  | User;
}

export const EmailWrapper = ({
  children,
  preview,
  heading,
  user,
}: EmailWrapperProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto font-sans bg-white">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
          <Img
            src={`${process.env.NEXT_TENNIS_CIRCLE_LOGO_URI}`}
            alt="Tennis Circle"
            height="80"
            className="mx-auto mt-4 object-fill"
          />
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            {heading}
          </Heading>

          {children}

          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Text className="text-[#666666] text-[12px] leading-[24px]">
            This email was intended for{" "}
            <span className="text-black">
              {user?.first_name} {user?.last_name}.
            </span>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
