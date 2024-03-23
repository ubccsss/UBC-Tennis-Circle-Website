import {
  format,
  parseISO,
  addHours as fnsAddHours,
  getMinutes,
} from "date-fns";

// two hour event time ranges from start time iso (e.g. 5pm to 7pm or 5:30pm to 7:30pm)
export const rangeHours = (
  iso: string,
  addHours: number = 2,
  offsetStartHours: number = 0,
) => {
  if (offsetStartHours !== 0) {
    return rangeHours(
      fnsAddHours(parseISO(iso), offsetStartHours).toISOString(),
      addHours,
      0,
    );
  }

  const parsedIso = parseISO(iso);

  const addedHours = fnsAddHours(parsedIso, addHours);

  const formatStr = (date: Date) => (getMinutes(date) === 0 ? "haa" : "h:mmaa");

  return `${format(parsedIso, formatStr(parsedIso))} - ${format(
    addedHours,
    formatStr(addedHours),
  )}`;
};
