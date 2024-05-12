import type { PublicHolidayRule } from "./PublicHolidayRule";
import {
  countHolidaysBetweenDates,
  isSameDay,
  nextWeekDay,
  previousWeekDay,
  weeksAndRemainingDaysBetweenDates,
  yearsBetweenDates,
} from "./utils";

export class BusinessDayCounter {
  WeekdaysBetweenTwoDates(firstDate: Date, secondDate: Date): number {
    if (firstDate > secondDate || isSameDay(firstDate, secondDate)) {
      return 0;
    }

    const weeksAndRemainingDays = weeksAndRemainingDaysBetweenDates(
      firstDate,
      secondDate,
    );

    let remainingDays = weeksAndRemainingDays.remainingDays;

    if (!remainingDays) return weeksAndRemainingDays.weeks * 5;

    const startDay = nextWeekDay(firstDate);
    const endDay = previousWeekDay(secondDate);

    if (startDay > endDay) {
      /*
       * eg
       *
       * 0 1 2 3 4 5 6
       * - - - - # # #
       * x x x x x x x
       * # # # - - - -
       *
       * or
       *
       * 0 1 2 3 4 5 6
       * - - - - - - #
       * x x x x x x x
       * # - - - - - -
       *
       */

      return weeksAndRemainingDays.weeks * 5 + remainingDays - 2;
    }

    if (startDay === endDay) {
      /*
       * eg
       *
       * 0 1 2 3 4 5 6
       * - - - - x x x
       * x x x x x x x
       * x x x x # - -
       */
      if (endDay === 0 || startDay === 6) {
        /*
         * eg
         *
         * 0 1 2 3 4 5 6
         * - - - - - - -
         * x x x x x x x
         * # - - - - - -
         *
         * or
         *
         * 0 1 2 3 4 5 6
         * - - - - - - #
         * x x x x x x x
         * x x x x x x x
         */
        remainingDays--;
      }

      return weeksAndRemainingDays.weeks * 5 + remainingDays;
    }

    if (startDay === 0 || endDay === 6) {
      /* startDay < endDay
       * eg
       *
       * 0 1 2 3 4 5 6
       * - # x x x x x
       * x x x x x x x
       * x x # - - - -
       *
       */

      /*
       * eg
       * 0 1 2 3 4 5 6
       * # x x x x x x
       * x x x x x x x
       * x # # - - - -
       *
       * or
       *
       * 0 1 2 3 4 5 6
       * - # # # # # x
       * x x x x x x x
       * x x x x x x #
       */

      remainingDays--;
    }

    return weeksAndRemainingDays.weeks * 5 + remainingDays;
  }

  BusinessDaysBetweenTwoDates(
    firstDate: Date,
    secondDate: Date,
    publicHolidays: Date[],
  ): number {
    const weekdays = this.WeekdaysBetweenTwoDates(firstDate, secondDate);
    const holidays = countHolidaysBetweenDates(
      firstDate,
      secondDate,
      publicHolidays,
    );

    return weekdays - holidays;
  }

  BusinessDaysBetweenTwoDatesWithHolidayRules(
    firstDate: Date,
    secondDate: Date,
    publicHolidayRules: PublicHolidayRule[],
  ): number {
    const weekdays = this.WeekdaysBetweenTwoDates(firstDate, secondDate);
    if (!weekdays) return 0;

    let holidays = 0;

    const years = yearsBetweenDates(firstDate, secondDate);

    for (const year of years) {
      // assuming no duplicated holiday rules
      const holidaysInYear = publicHolidayRules.map((rule) =>
        rule.DateOfYear(year),
      );

      const numberOfHolidaysInYear = countHolidaysBetweenDates(
        firstDate,
        secondDate,
        holidaysInYear,
      );

      holidays += numberOfHolidaysInYear;
    }

    // Approach2, can prevent duplicated holiday rules but it is much slower
    //
    // const loopDate = new Date(firstDate.getTime() + MILLISECONDS_IN_A_DAY);
    // while (loopDate < secondDate) {
    // 	if (loopDate.getDay() === 6 || loopDate.getDay() === 0) {
    // 		continue;
    // 	}

    // 	const matches = publicHolidayRules.map((rule) =>
    // 		rule.DateMatchesThisRule(loopDate),
    // 	);

    // 	if (matches.some(Boolean)) {
    // 		holidays++;
    // 	}

    // 	loopDate.setDate(loopDate.getDate() + 1);
    // }

    return weekdays - holidays;
  }
}
