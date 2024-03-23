import { AttendeeList, User } from "@models";
import { rangeHours } from "@utils";

export const mergeAttendees = async (
  slot1List: AttendeeList,
  slot2List: AttendeeList,
  date: string,
  select: string,
) => {
  const userIdList = [
    ...new Set([...slot1List.attendees, ...slot2List.attendees]),
  ];

  const createTimeStr = (userId: string) => {
    const includesSlot1 = slot1List.attendees.includes(userId);
    const includesSlot2 = slot2List.attendees.includes(userId);

    if (includesSlot1 && includesSlot2) {
      return rangeHours(date, 2, 0);
    }

    if (includesSlot1) {
      return rangeHours(date, 1, 0);
    }

    return rangeHours(date, 1, 1);
  };

  const users = await User.find({ _id: { $in: userIdList } })
    .select(select)
    .lean();

  const scheduledUsers = users.map((i) => ({
    ...i,
    time: createTimeStr(i._id),
  }));

  return scheduledUsers;
};
