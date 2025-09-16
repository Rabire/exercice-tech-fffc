import {
  type ColumnSpec,
  type ColumnType,
  type Metadata,
  MetadataRowSchema,
  MetadataSchema,
} from "./types.ts";

const TYPE_ALIASES: Record<string, ColumnType> = {
  date: "date",
  // French
  numérique: "numeric",
  numerique: "numeric",
  numeric: "numeric",
  number: "numeric",
  // strings
  string: "string",
  chaine: "string",
  chaîne: "string",
  texte: "string",
};

function normalizeType(raw: string): ColumnType {
  const key = raw.trim().toLowerCase();
  const mapped = TYPE_ALIASES[key];

  if (!mapped) throw new Error(`Unsupported column type: ${raw}`);

  return mapped;
}

export async function parseMetadataFromBlob(blob: Blob): Promise<Metadata> {
  // Metadata is expected to be small; load fully in memory for simplicity and robustness
  const text = await blob.text();

  return parseMetadataFromString(text);
}

function parseMetadataFromString(text: string): Metadata {
  // Remove Byte Order Mark if present
  const clean = text.replace(/^\uFEFF/, "");

  // Split into lines and remove empty lines
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const columns: ColumnSpec[] = [];

  for (let i = 0; i < lines.length; i++) {
    // Parse each character in the line
    const line = lines[i];
    const cells = parseCsvLine(line ?? "");

    // Check if the line has the correct number of columns
    if (cells.length !== 3)
      throw new Error(
        `Invalid metadata at line ${i + 1}: expected 3 columns, got ${
          cells.length
        }`
      );

    const [name, lenStr, typeStr] = cells as [string, string, string]; // safe cast to tuple type

    const row = MetadataRowSchema.safeParse([
      name,
      lenStr,
      normalizeType(typeStr),
    ]);

    if (!row.success) {
      const issue = row.error.issues[0]?.message;
      throw new Error(`Invalid metadata at line ${i + 1}: ${issue}`);
    }

    const [, length, type] = row.data;
    columns.push({ name, length, type });
  }

  const result = MetadataSchema.safeParse({ columns });
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Invalid metadata: ${issue}`);
  }

  return result.data;
}

// Minimal CSV line parser supporting quotes and commas
function parseCsvLine(line: string): string[] {
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

// TODO: support reading metadata from streams for gigantic definitions
// TODO: support comments (# ...) and blank lines in metadata
