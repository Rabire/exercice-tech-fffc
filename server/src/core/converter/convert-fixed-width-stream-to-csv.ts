import { type Metadata } from "../types.ts";
import { escapeCsv } from "./escape-csv.ts";
import { processFixedWidthLine } from "./process-fixed-width-line.ts";

export async function* convertFixedWidthStreamToCsv(
  readable: ReadableStream<Uint8Array>,
  metadata: Metadata
): AsyncGenerator<Uint8Array> {
  // Initialize text encoder/decoder for binary stream handling
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8");

  // Line break format per spec: Windows CRLF
  const lb = "\r\n";

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
    // Remove CR/LF separators so fixed-width slicing stays aligned across records
    if (carry.includes("\n") || carry.includes("\r")) {
      carry = carry.replace(/\r?\n/g, "");
    }

    // Process all complete fixed-width records in buffer
    while (carry.length >= expectedLineLen) {
      // Extract one complete record from buffer
      const line = carry.slice(0, expectedLineLen);
      carry = carry.slice(expectedLineLen); // Remove processed data from buffer

      // Consume any accidental CR/LF separators left between records
      if (carry.length && (carry[0] === "\n" || carry[0] === "\r")) {
        carry = carry.replace(/^\r?\n+/, "");
      }

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
      `[TRUNCATED_DATA_ERROR] Incomplete data at end of stream: ${
        carry.length
      } remaining bytes cannot form a complete record (expected ${expectedLineLen} bytes per record). Remaining data: '${carry.slice(
        0,
        50
      )}${carry.length > 50 ? "..." : ""}'`
    );
  }
}
