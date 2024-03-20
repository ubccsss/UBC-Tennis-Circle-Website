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
import * as React from "react";

interface DeleteEmailProps {
  event_name: string;
}

export const DeleteEmail = ({ event_name }: DeleteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Cancellation of {event_name}</Preview>
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
              Cancellation of {event_name}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hey, we are sorry to inform you that {event_name} has been
              cancelled. Your tickets will be automatically refunded.
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DeleteEmail;
