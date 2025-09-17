import {
  type ColumnSpec,
  type Metadata,
  MetadataRowSchema,
  MetadataSchema,
} from "../types.ts";
import { normalizeType } from "./normalize-type.ts";
import { parseCsvLine } from "./parse-csv-line.ts";

export function parseMetadataFromString(text: string): Metadata {
  // Remove Byte Order Mark if present
  const clean = text.replace(/^\uFEFF/, "");

  // Split into lines and remove empty lines
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const columns: ColumnSpec[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cells = parseCsvLine(line ?? "");

    if (cells.length !== 3)
      throw new Error(
        `Invalid metadata at line ${i + 1}: expected 3 columns, got ${
          cells.length
        }`
      );

    const [name, lenStr, typeStr] = cells as [string, string, string];

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
