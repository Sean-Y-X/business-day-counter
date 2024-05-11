export function nextWeekDay(date: Date): number {
	const currentDay = date.getDay();

	if (currentDay === 6) {
		return 0;
	}

	return currentDay + 1;
}
