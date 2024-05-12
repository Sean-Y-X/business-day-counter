import { MILLISECONDS_IN_A_DAY, WEEK_TO_DAYS } from "../constants";

export type WeeksAndRemainingDaysBetweenDates = {
  weeks: number;
  remainingDays: number;
};

export function weeksAndRemainingDaysBetweenDates(
  firstDate: Date,
  secondDate: Date,
): WeeksAndRemainingDaysBetweenDates {
  const differenceInMilliseconds =
    secondDate.getTime() - firstDate.getTime() - MILLISECONDS_IN_A_DAY;
  const differenceInDays = differenceInMilliseconds / MILLISECONDS_IN_A_DAY;

  const weeks = Math.floor(differenceInDays / WEEK_TO_DAYS);
  const remainingDays = differenceInDays % WEEK_TO_DAYS;

  return { weeks, remainingDays };
}