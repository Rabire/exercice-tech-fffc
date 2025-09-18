import { describe, expect, test } from "bun:test";
import { escapeCsv } from "./escape-csv";

describe("escapeCsv", () => {
  test("returns value unchanged when no special chars", () => {
    expect(escapeCsv("hello")).toBe("hello");
  });

  test("wraps in quotes when value contains comma", () => {
    expect(escapeCsv("a,b")).toBe('"a,b"');
  });

  test("wraps in quotes when value contains quotes and doubles them", () => {
    expect(escapeCsv('a "quote" b')).toBe('"a ""quote"" b"');
  });

  test("wraps in quotes when value contains CR/LF", () => {
    expect(escapeCsv("line1\nline2")).toBe('"line1\nline2"');
    expect(escapeCsv("line1\rline2")).toBe('"line1\rline2"');
  });
});
