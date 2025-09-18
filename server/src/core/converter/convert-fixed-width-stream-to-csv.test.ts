import { describe, expect, test } from "bun:test";
import { type Metadata } from "../types";
import { convertFixedWidthStreamToCsv } from "./index";

// Helper function to create a ReadableStream from string chunks for testing
function makeReadable(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      // Encode each string chunk to bytes and enqueue it
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

// Test metadata with two columns: numeric id (4 chars) and string name (6 chars)
const meta: Metadata = {
  columns: [
    { name: "id", length: 4, type: "numeric" },
    { name: "name", length: 6, type: "string" },
  ],
};

// Helper to create a fixed-width record by padding values to their column lengths
function record(id: string, name: string): string {
  const pad = (v: string, len: number) => (v + " ".repeat(len)).slice(0, len);
  return pad(id, 4) + pad(name, 6);
}

// Helper to collect all chunks from an async generator into a single string
async function collect(gen: AsyncGenerator<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();
  let out = "";
  for await (const chunk of gen) out += decoder.decode(chunk);
  return out;
}

describe("convertFixedWidthStreamToCsv", () => {
  test("emits header and records across chunk boundaries, uses CRLF", async () => {
    // Test streaming robustness: verifies that fixed-width records split across chunk boundaries are correctly reassembled into proper CSV with CRLF line endings and padding removal
    const r1 = record("0001", "Alice");
    const r2 = record("0002", "Bob");
    // Split chunks intentionally in the middle to test buffering/realignment
    const chunks = [
      r1.slice(0, 5),
      r1.slice(5) + "\r\n" + r2.slice(0, 3),
      r2.slice(3) + "\n\r\n", // stray EOLs should be stripped
    ];

    const readable = makeReadable(chunks);
    const gen = convertFixedWidthStreamToCsv(readable, meta);
    const csv = await collect(gen);

    expect(csv).toBe(
      [
        "id,name\r\n", // header
        "0001,Alice\r\n", // trimEnd removes padding, no quoting needed
        "0002,Bob\r\n",
      ].join("")
    );
  });

  test("handles multi-byte UTF-8 characters split across chunk boundaries", async () => {
    const r = record("0005", "Café"); // contains é (multi-byte)
    // Split in the middle of the multi-byte character by slicing the encoded bytes
    const enc = new TextEncoder();
    const bytes = enc.encode(r);
    const eBytes = enc.encode("é");
    const firstByteOfE = eBytes[0]!; // explicit: we know "é" encodes to >= 1 byte in UTF-8
    const splitIndex = bytes.indexOf(firstByteOfE);
    const part1 = bytes.slice(0, splitIndex + 1);
    const part2 = bytes.slice(splitIndex + 1);

    // Enqueue split bytes contiguously (no extra bytes between split), then CRLF
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(part1);
        c.enqueue(part2);
        c.enqueue(new TextEncoder().encode("\r\n"));
        c.close();
      },
    });

    const gen = convertFixedWidthStreamToCsv(stream, meta);
    const csv = await collect(gen);
    expect(csv).toBe(["id,name\r\n", "0005,Café\r\n"].join(""));
  });

  test("propagates processing errors (invalid numeric)", async () => {
    const bad = record("12a4", "Alice");
    const readable = makeReadable([bad]);
    const gen = convertFixedWidthStreamToCsv(readable, meta);
    await expect((async () => await collect(gen))()).rejects.toThrow(
      /NUMERIC_FORMAT_ERROR/
    );
  });

  test("throws on truncated data at end of stream", async () => {
    const r = record("0003", "Eve");
    const incomplete = r.slice(0, r.length - 2); // missing last bytes
    const readable = makeReadable([incomplete]);
    const gen = convertFixedWidthStreamToCsv(readable, meta);
    await expect((async () => await collect(gen))()).rejects.toThrow(
      /TRUNCATED_DATA_ERROR/
    );
  });
});
