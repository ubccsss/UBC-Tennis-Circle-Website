import { Button, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailWrapper } from "./shared";
import { User } from "lucia";
import { format } from "date-fns";
import { TennisEvent } from "@types";

interface ReminderEmailProps {
  user: User;
  event: TennisEvent;
}

export const ReminderEmail = ({ user, event }: ReminderEmailProps) => {
  const title = `Reminder: ${event.name} is happening on ${format(
    event.date,
    "MMM do",
  )}`;

  return (
    <EmailWrapper user={user} preview={title} heading={title}>
      <Text className="text-black text-[14px] leading-[24px]">
        Hey <b>{user.first_name}</b>, this email is a reminder that you are
        registered for {event.name} from {user.time}.
      </Text>
    </EmailWrapper>
  );
};

export default ReminderEmail;
