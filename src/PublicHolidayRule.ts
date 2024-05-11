import { isSameDay } from "./utils";

export type FixedDayRule = {
  dayOfMonth: number;
  month: number;
  shouldDeferToMonday: boolean;
  weekday?: never;
  weekOfMonth?: never;
};

export type WeekdayOfMonthRule = {
  weekday: number;
  weekOfMonth: number;
  month: number;
  dayOfMonth?: never;
  shouldDeferToMonday?: never;
};

export type PublicHolidayRuleProps = FixedDayRule | WeekdayOfMonthRule;

export class PublicHolidayRule {
  protected month: number;

  protected dayOfMonth?: number;
  protected shouldDeferToMonday?: boolean;

  protected weekday?: number;
  protected weekOfMonth?: number;

  constructor({
    dayOfMonth,
    month,
    shouldDeferToMonday,
    weekday,
    weekOfMonth,
  }: PublicHolidayRuleProps) {
    this.dayOfMonth = dayOfMonth;
    this.month = month;
    this.shouldDeferToMonday = shouldDeferToMonday;
    this.weekday = weekday;
    this.weekOfMonth = weekOfMonth;
  }

  DateOfYear(year: number): Date {
    // FixedDayRule
    if (this.dayOfMonth) {
      const tempDate = new Date(Date.UTC(year, this.month, this.dayOfMonth));
      // if the day is a saturday
      if (this.shouldDeferToMonday && tempDate.getDay() === 6) {
        return new Date(year, this.month, this.dayOfMonth + 2);
      }
      // if the day is a sunday
      if (this.shouldDeferToMonday && tempDate.getDay() === 0) {
        return new Date(year, this.month, this.dayOfMonth + 1);
      }

      return tempDate;
    }

    // WeekdayOfMonthRule
    const firstDateOfMonth = new Date(Date.UTC(year, this.month, 1));
    const firstWeekDayOfMonth = firstDateOfMonth.getDay();

    // Based on Monday being the first day of week
    const startDayOfFirstWeekInMonth =
      firstWeekDayOfMonth === 1 ? 1 : 9 - (firstWeekDayOfMonth || 7);

    const calcDateOfMonth =
      startDayOfFirstWeekInMonth +
      (this.weekOfMonth! - 1) * 7 +
      (this.weekday || 7) -
      1;

    return new Date(Date.UTC(year, this.month, calcDateOfMonth));
  }

  DateMatchesThisRule(date: Date): boolean {
    const dateThisYear = this.DateOfYear(date.getFullYear());

    return isSameDay(date, dateThisYear);
  }
}
