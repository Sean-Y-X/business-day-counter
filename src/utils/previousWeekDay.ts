export function previousWeekDay(date: Date): number {
	const currentDay = date.getDay();

	if (currentDay === 0) {
		return 6;
	}

	return currentDay - 1;
}
