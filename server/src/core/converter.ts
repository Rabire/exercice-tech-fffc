import { type Metadata } from "./types.ts";

export interface ConvertFixedWidthToCsvOptions {
  lineBreak?: "\n" | "\r\n";
}

export function formatDateToDDMMYYYY(input: string): string {
  // input YYYY-MM-DD -> DD/MM/YYYY
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) {
    throw new Error(`Invalid date value: ${input}`);
  }
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

export function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return '"' + value.replaceAll('"', '""') + '"';
  }
  return value;
}

export function processFixedWidthLine(
  line: string,
  metadata: Metadata
): string[] {
  const cells: string[] = [];
  let offset = 0;
  for (const col of metadata.columns) {
    const raw = line.slice(offset, offset + col.length);
    if (raw.length < col.length) {
      throw new Error(
        `Data line too short. Expected at least ${
          offset + col.length
        } chars, got ${line.length}`
      );
    }
    let value = raw;
    switch (col.type) {
      case "string": {
        value = value.replace(/\s+$/g, "");
        if (/\r|\n/.test(value)) {
          throw new Error(`CR/LF not allowed in string column '${col.name}'`);
        }
        break;
      }
      case "date": {
        value = value.trim();
        value = formatDateToDDMMYYYY(value);
        break;
      }
      case "numeric": {
        value = value.trim();
        if (!/^-?\d+(?:\.\d+)?$/.test(value)) {
          throw new Error(`Invalid numeric value: ${value}`);
        }
        break;
      }
    }
    cells.push(value);
    offset += col.length;
  }
  if (line.slice(offset).trim().length > 0) {
    // extra data after defined columns is considered an error
    throw new Error(
      `Data line longer than expected. Extra content starting at index ${offset}`
    );
  }
  return cells;
}

/**
 * Converts a fixed-width data stream to CSV format.
 *
 * This function processes a ReadableStream of fixed-width records and yields CSV data chunks.
 * It reads the stream incrementally, extracts complete fixed-width lines based on the expected
 * record length, processes each line according to the column metadata (trimming strings,
 * formatting dates, validating numerics), and outputs properly escaped CSV rows.
 *
 * @param readable - The input stream containing fixed-width data
 * @param metadata - Column definitions specifying field names, types, and lengths
 * @param opts - Optional configuration for line breaks
 * @yields Uint8Array chunks containing CSV data (header + data rows)
 * @throws Error if data is malformed, truncated, or doesn't match expected format
 */
export async function* convertFixedWidthStreamToCsv(
  readable: ReadableStream<Uint8Array>,
  metadata: Metadata,
  opts?: ConvertFixedWidthToCsvOptions
): AsyncGenerator<Uint8Array> {
  // Initialize text encoder/decoder for binary stream handling
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8");

  // Set line break format (default to Windows CRLF)
  const lb = opts?.lineBreak ?? "\r\n";

  // Generate and yield CSV header row from column names
  const header = metadata.columns.map((c) => c.name).join(",") + lb;
  yield encoder.encode(header);

  // Get stream reader and initialize buffer for incomplete data
  const reader = readable.getReader();
  let carry = ""; // Buffer to hold partial data between reads

  // Calculate expected length of each fixed-width record
  const expectedLineLen = metadata.columns.reduce((s, c) => s + c.length, 0);

  // Main streaming loop
  while (true) {
    // Read next chunk from stream
    const { done, value } = await reader.read();
    if (done) break; // End of stream reached

    // Decode binary chunk to text and append to buffer
    carry += decoder.decode(value, { stream: true });

    // Process all complete fixed-width records in buffer
    while (carry.length >= expectedLineLen) {
      // Extract one complete record from buffer
      const line = carry.slice(0, expectedLineLen);
      carry = carry.slice(expectedLineLen); // Remove processed data from buffer

      // Parse fixed-width line into individual cell values
      const cells = processFixedWidthLine(line, metadata);

      // Escape CSV special characters and join cells into CSV row
      const escaped = cells.map(escapeCsv).join(",") + lb;

      // Yield encoded CSV row as binary chunk
      yield encoder.encode(escaped);
    }
  }

  // Validate no incomplete data remains after stream ends
  if (carry.trim().length > 0) {
    throw new Error(
      `Truncated data: remaining ${carry.length} bytes do not form a complete record of length ${expectedLineLen}`
    );
  }
}

export function convertFixedWidthIterableToCsv(
  iterable: Iterable<string> | AsyncIterable<string>,
  metadata: Metadata,
  opts?: ConvertFixedWidthToCsvOptions
): AsyncGenerator<string> {
  const lb = opts?.lineBreak ?? "\r\n";
  async function* run() {
    yield metadata.columns.map((c) => c.name).join(",") + lb;
    for await (const line of iterable) {
      const cells = processFixedWidthLine(line, metadata);
      yield cells.map(escapeCsv).join(",") + lb;
    }
  }
  return run();
}

// TODO: support custom CSV delimiters and quote policies
// TODO: expose row number in errors for better diagnostics
// TODO: add backpressure-aware pipeline builder for Bun/FileSystem streams
