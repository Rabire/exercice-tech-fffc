export function formatDateToDDMMYYYY(input: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());

  if (!match)
    throw new Error(
      `[DATE_FORMAT_ERROR] Invalid date format: '${input}'. Expected format: YYYY-MM-DD`
    );

  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}
