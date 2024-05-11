export function beginningOfDay(date: Date): Date {
  const beginningOfDay = new Date(date);
  beginningOfDay.setHours(0);
  beginningOfDay.setMinutes(0);
  beginningOfDay.setSeconds(0);
  beginningOfDay.setMilliseconds(0);

  return beginningOfDay;
}
