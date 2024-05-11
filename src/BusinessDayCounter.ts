import type { PublicHolidayRule } from "./PublicHolidayRule";
import {
  DAY_TO_HOURS,
  HOUR_TO_MINUTES,
  MINUTE_TO_SECONDS,
  SECOND_TO_MILLISECONDS,
} from "./constants";
import { beginningOfDay, nextWeekDay, previousWeekDay } from "./utils";

const MILLISECONDS_IN_A_DAY =
  DAY_TO_HOURS * HOUR_TO_MINUTES * MINUTE_TO_SECONDS * SECOND_TO_MILLISECONDS;

export class BusinessDayCounter {
  WeekdaysBetweenTwoDates(firstDate: Date, secondDate: Date): number {
    // in case the date contains h/m/s/ms
    const trimmedFirstDate = beginningOfDay(firstDate);
    const trimmedSecondDate = beginningOfDay(secondDate);

    const firstDateMs = trimmedFirstDate.getTime();
    const secondDateMs = trimmedSecondDate.getTime();

    if (firstDateMs >= secondDateMs) {
      return 0;
    }

    const differenceMs = secondDateMs - (firstDateMs + MILLISECONDS_IN_A_DAY);

    const daysDifference = Math.floor(differenceMs / MILLISECONDS_IN_A_DAY);

    const weeksCount = Math.floor(daysDifference / 7);
    let remainingDays = daysDifference % 7;

    if (!remainingDays) return weeksCount * 5;

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

      return weeksCount * 5 + remainingDays - 2;
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

      return weeksCount * 5 + remainingDays;
    }

    /* startDay < endDay
     * eg
     *
     * 0 1 2 3 4 5 6
     * - # x x x x x
     * x x x x x x x
     * x x # - - - -
     *
     */

    if (startDay === 0 || endDay === 6) {
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

    return weeksCount * 5 + remainingDays;
  }

  BusinessDaysBetweenTwoDates(
    firstDate: Date,
    secondDate: Date,
    publicHolidays: Date[],
  ): number {
    const weekdays = this.WeekdaysBetweenTwoDates(firstDate, secondDate);
    let businessDays = weekdays;

    for (const holiday of publicHolidays) {
      if (
        holiday > firstDate &&
        holiday < secondDate &&
        holiday.getDay() !== 0 &&
        holiday.getDay() !== 6
      ) {
        businessDays--;
      }
    }

    return businessDays;
  }

  BusinessDaysBetweenTwoDatesWithHolidayRules(
    firstDate: Date,
    secondDate: Date,
    publicHolidayRules: PublicHolidayRule[],
  ): number {
    const weekdays = this.WeekdaysBetweenTwoDates(firstDate, secondDate);
    if (!weekdays) return 0;

    let businessDays = weekdays;

    let beginYear = firstDate.getFullYear();
    const secondDateYear = secondDate.getFullYear();
    const years: number[] = [];

    while (beginYear <= secondDateYear) {
      years.push(beginYear);
      beginYear++;
    }

    for (const year of years) {
      const holidays = publicHolidayRules.map((rule) => rule.DateOfYear(year));

      // assuming rules do not contain duplicates
      for (const holiday of holidays) {
        if (
          holiday > firstDate &&
          holiday < secondDate &&
          holiday.getDay() !== 0 &&
          holiday.getDay() !== 6
        ) {
          businessDays--;
        }
      }
    }

    // Approach2, can prevent duplicated holiday rules but it is much slower
    // const loopDate = new Date(firstDate.getTime() + MILLISECONDS_IN_A_DAY);
    // while (loopDate < secondDate) {
    // 	if (loopDate.getDay() === 6 || loopDate.getDay() === 0) {
    // 		continue;
    // 	}

    // 	const matches = publicHolidayRules.map((rule) =>
    // 		rule.DateMatchesThisRule(loopDate),
    // 	);

    // 	if (matches.some(Boolean)) {
    // 		businessDays--;
    // 	}

    // 	loopDate.setDate(loopDate.getDate() + 1);
    // }

    return businessDays;
  }
}
