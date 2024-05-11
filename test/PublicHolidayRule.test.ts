import type { FixedDayRule, WeekdayOfMonthRule } from "../src";
import { PublicHolidayRule } from "../src";

const kingsBirthdayRule: WeekdayOfMonthRule = {
  weekday: 1,
  weekOfMonth: 2,
  month: 5,
};
const kingsBirthdayPublicHolidayRule = new PublicHolidayRule(kingsBirthdayRule);

const fixedDayRule: FixedDayRule = {
  dayOfMonth: 1,
  month: 5,
  shouldDeferToMonday: false,
};
const fixedDayPublicHolidayRule = new PublicHolidayRule(fixedDayRule);

const fixedDayWithDeferRule: FixedDayRule = {
  dayOfMonth: 1,
  month: 0,
  shouldDeferToMonday: true,
};
const fixedDayWithDeferPublicHolidayRule = new PublicHolidayRule(
  fixedDayWithDeferRule,
);

describe("Test PublicHolidayRule Class", () => {
  describe("Test kingsBirthdayRule", () => {
    test("Date match KingsBirthday", () => {
      const kingsBirthday2024 = new Date("2024-06-10");
      const kingsBirthday2025 = new Date("2025-06-09");

      expect(
        kingsBirthdayPublicHolidayRule.DateMatchesThisRule(kingsBirthday2024),
      ).toBe(true);
      expect(
        kingsBirthdayPublicHolidayRule.DateMatchesThisRule(kingsBirthday2025),
      ).toBe(true);
    });

    test("Date does not match KingsBirthday", () => {
      const date = new Date("2024-06-11");

      expect(kingsBirthdayPublicHolidayRule.DateMatchesThisRule(date)).toBe(
        false,
      );
    });
  });

  describe("Test fixedDayRule", () => {
    test("Date match", () => {
      const fixedDay2024 = new Date("2024-06-01"); // Sat
      const fixedDay2025 = new Date("2025-06-01"); // Sun
      const fixedDay2026 = new Date("2026-06-01"); // Mon

      expect(fixedDayPublicHolidayRule.DateMatchesThisRule(fixedDay2024)).toBe(
        true,
      );
      expect(fixedDayPublicHolidayRule.DateMatchesThisRule(fixedDay2025)).toBe(
        true,
      );
      expect(fixedDayPublicHolidayRule.DateMatchesThisRule(fixedDay2026)).toBe(
        true,
      );
    });

    test("Date does not match", () => {
      const fixedDay = new Date("2024-05-01");

      expect(fixedDayPublicHolidayRule.DateMatchesThisRule(fixedDay)).toBe(
        false,
      );
    });
  });

  describe("Test fixedDayWithDeferRule", () => {
    test("Date match", () => {
      const newYearDay2022 = new Date("2022-01-03"); // Mon
      const newYearDay2023 = new Date("2023-01-02"); // Mon
      const newYearDay2024 = new Date("2024-01-01"); // Mon

      expect(
        fixedDayWithDeferPublicHolidayRule.DateMatchesThisRule(newYearDay2022),
      ).toBe(true);
      expect(
        fixedDayWithDeferPublicHolidayRule.DateMatchesThisRule(newYearDay2023),
      ).toBe(true);
      expect(
        fixedDayWithDeferPublicHolidayRule.DateMatchesThisRule(newYearDay2024),
      ).toBe(true);
    });

    test("Date does not match", () => {
      const fixedDay = new Date("2022-01-01");

      expect(
        fixedDayWithDeferPublicHolidayRule.DateMatchesThisRule(fixedDay),
      ).toBe(false);
    });
  });
});
