import { type Metadata } from "../types.ts";
import { formatDateToDDMMYYYY } from "./format-date.ts";

export function processFixedWidthLine(
  line: string,
  metadata: Metadata
): string[] {
  const cells: string[] = [];
  let offset = 0;

  try {
    for (const col of metadata.columns) {
      const raw = line.slice(offset, offset + col.length);

      if (raw.length < col.length) {
        throw new Error(
          `[LINE_LENGTH_ERROR] Data line too short at column '${
            col.name
          }'. Expected at least ${offset + col.length} characters, got ${
            line.length
          }`
        );
      }

      let value = raw;

      switch (col.type) {
        case "string": {
          value = value.trimEnd();

          if (value.includes("\n") || value.includes("\r"))
            throw new Error(
              `[STRING_FORMAT_ERROR] Line breaks (CR/LF) are not allowed in string column '${
                col.name
              }'. Value: '${value.slice(0, 50)}${
                value.length > 50 ? "..." : ""
              }'`
            );

          break;
        }

        case "date": {
          value = value.trim();
          value = formatDateToDDMMYYYY(value);
          break;
        }

        case "numeric": {
          value = value.trim();

          if (!/^-?\d+(?:\.\d+)?$/.test(value))
            throw new Error(
              `[NUMERIC_FORMAT_ERROR] Invalid numeric value in column '${col.name}': '${value}'. Expected format: integer or decimal number (e.g., 123 or 123.45)`
            );

          break;
        }
      }

      cells.push(value);
      offset += col.length;
    }

    if (line.slice(offset).trim().length > 0) {
      // extra data after defined columns is considered an error
      throw new Error(
        `[LINE_LENGTH_ERROR] Data line contains unexpected extra content starting at position ${offset}. Extra data: '${line
          .slice(offset)
          .slice(0, 20)}${line.slice(offset).length > 20 ? "..." : ""}'`
      );
    }

    return cells;
  } catch (error) {
    console.error(`Error processing line: "${line}"`);
    throw error;
  }
}
