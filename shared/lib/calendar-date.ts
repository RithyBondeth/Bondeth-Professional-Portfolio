/** Date-picker values represent calendar days, independent of UTC offsets. */
export function calendarDateFromISO(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  // Local noon avoids daylight-saving transitions around midnight.
  return new Date(year, month - 1, day, 12);
}

export function calendarDateToISO(value: Date): string {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");
}
