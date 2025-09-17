export function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return '"' + value.replaceAll('"', '""') + '"';

  return value;
}
