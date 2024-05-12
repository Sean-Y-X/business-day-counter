export function countHolidaysBetweenDates(
  firstDate: Date,
  secondDate: Date,
  holidays: Date[],
): number {
  return holidays.reduce((acc, holiday) => {
    const match =
      holiday > firstDate &&
      holiday < secondDate &&
      holiday.getDay() !== 0 &&
      holiday.getDay() !== 6;

    return match ? acc + 1 : acc;
  }, 0);
}