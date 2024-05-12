export function yearsBetweenDates(firstDate: Date, secondDate: Date): number[] {
  if (firstDate > secondDate) {
    return [];
  }

  const startYear = firstDate.getFullYear();
  const endYear = secondDate.getFullYear();

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
}