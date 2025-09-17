// Minimal CSV line parser supporting quotes and commas
export function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    switch (true) {
      case inQuotes && char === '"' && nextChar === '"':
        // Escaped quote
        current += '"';
        i++;
        break;

      case inQuotes && char === '"':
        // End quote
        inQuotes = false;
        break;

      case inQuotes:
        current += char;
        break;

      case char === '"':
        inQuotes = true;
        break;

      case char === ",":
        values.push(current);
        current = "";
        break;

      default:
        current += char;
    }
  }

  values.push(current);
  return values.map((v) => v.trim());
}
