import { BusinessDayCounter } from "../src";

const businessDayCounter = new BusinessDayCounter();
const samplePublicHolidays = [
	new Date("2013-12-25"),
	new Date("2013-12-26"),
	new Date("2014-01-01"),
];
const publicHolidaysOnWeekends = [
	// Sat
	new Date("2024-05-11"),
	// Sun
	new Date("2024-05-19"),
];

describe("Test BusinessDayCounter Class", () => {
	describe("Test WeekdaysBetweenTwoDates", () => {
		test("Provided test case 1", () => {
			const firstDate = new Date("2013-10-07");
			const secondDate = new Date("2013-10-09");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(1);
		});

		test("Provided test case 2", () => {
			const firstDate = new Date("2013-10-05");
			const secondDate = new Date("2013-10-14");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(5);
		});

		test("Provided test case 3", () => {
			const firstDate = new Date("2013-10-07");
			const secondDate = new Date("2014-01-01");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(61);
		});

		test("Provided test case 4 (Second date earlier than first date)", () => {
			const firstDate = new Date("2013-10-07");
			const secondDate = new Date("2013-10-05");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(0);
		});

		test("Same day", () => {
			const firstDate = new Date("2024-01-01");
			const secondDate = new Date("2024-01-01");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(0);
		});

		test("Same week, not includes weekend", () => {
			const firstDate = new Date("2024-05-07");
			const secondDate = new Date("2024-05-10");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(2);
		});

		test("Weekends only", () => {
			const firstDate = new Date("2024-05-10");
			const secondDate = new Date("2024-05-13");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(0);
		});

		test("Same week, ends on Sat", () => {
			const firstDate = new Date("2024-05-07");
			const secondDate = new Date("2024-05-12");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(3);
		});

		test("Same week, ends on Sun", () => {
			const firstDate = new Date("2024-05-07");
			const secondDate = new Date("2024-05-13");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(3);
		});

		test("Starts on week day, ends on weekend", () => {
			const firstDate = new Date("2024-05-07");
			const secondDate = new Date("2024-05-27");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(13);
		});

		test("Starts on week day, ends on week day, start day of week < end day of week", () => {
			const firstDate = new Date("2024-05-07");
			const secondDate = new Date("2024-05-30");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(16);
		});

		test("Start day end day both on Sat", () => {
			const firstDate = new Date("2024-04-05");
			const secondDate = new Date("2024-05-05");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(20);
		});

		test("Start day on Sat, end on Sun", () => {
			const firstDate = new Date("2024-04-05");
			const secondDate = new Date("2024-05-05");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(20);
		});

		test("Start day of week > end day day of week", () => {
			const firstDate = new Date("2024-05-02");
			const secondDate = new Date("2024-05-14");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(7);
		});

		test("Start day on Sat, ends on week day", () => {
			const firstDate = new Date("2024-05-03");
			const secondDate = new Date("2024-05-14");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(6);
		});

		test("Start day on Sun, ends on week day", () => {
			const firstDate = new Date("2024-05-04");
			const secondDate = new Date("2024-05-14");

			expect(
				businessDayCounter.WeekdaysBetweenTwoDates(firstDate, secondDate),
			).toBe(6);
		});
	});

	describe("Test BusinessDaysBetweenTwoDates", () => {
		test("Provided test case 1", () => {
			const firstDate = new Date("2013-10-07");
			const secondDate = new Date("2013-10-09");

			expect(
				businessDayCounter.BusinessDaysBetweenTwoDates(
					firstDate,
					secondDate,
					samplePublicHolidays,
				),
			).toBe(1);
		});

		test("Provided test case 2", () => {
			const firstDate = new Date("2013-12-24");
			const secondDate = new Date("2013-12-27");

			expect(
				businessDayCounter.BusinessDaysBetweenTwoDates(
					firstDate,
					secondDate,
					samplePublicHolidays,
				),
			).toBe(0);
		});

		test("Provided test case 3", () => {
			const firstDate = new Date("2013-10-07");
			const secondDate = new Date("2014-01-01");

			expect(
				businessDayCounter.BusinessDaysBetweenTwoDates(
					firstDate,
					secondDate,
					samplePublicHolidays,
				),
			).toBe(59);
		});

		test("Holiday on weekends", () => {
			const firstDate = new Date("2024-05-07");
			const secondDate = new Date("2024-05-30");

			expect(
				businessDayCounter.BusinessDaysBetweenTwoDates(
					firstDate,
					secondDate,
					publicHolidaysOnWeekends,
				),
			).toBe(16);
		});
	});

	describe("Test BusinessDaysBetweenTwoDatesWithHolidayRules", () => {
		// TODO
	});
});
