type DividedDate = { day: number; month: number; year: number };

export function compareDates(dateA: DividedDate, dateB: DividedDate) {
  if (dateA.year < dateB.year) return -1;
  if (dateA.year > dateB.year) return 1;

  if (dateA.month < dateB.month) return -1;
  if (dateA.month > dateB.month) return 1;

  if (dateA.day < dateB.day) return -1;
  if (dateA.day > dateB.day) return 1;

  return 0;
}

export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * @param month Month index: January 0, February 1, ...
 * @param year Year number
 * @returns The number of days in the month of the year
 */
export function getNumberOfDaysInMonth(month: number, year: number): number {
  // by using 0 as the day it will give us the last day of the prior month
  return new Date(year, month + 1, 0).getDate();
}