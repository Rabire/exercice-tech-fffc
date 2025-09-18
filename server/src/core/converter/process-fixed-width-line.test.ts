import { describe, expect, test } from "bun:test";
import { type Metadata } from "../types";
import { processFixedWidthLine } from "./process-fixed-width-line";

const meta: Metadata = {
  columns: [
    { name: "id", length: 4, type: "numeric" },
    { name: "name", length: 10, type: "string" },
    { name: "created", length: 10, type: "date" },
  ],
};

function pad(value: string, len: number): string {
  return (value + " ".repeat(len)).slice(0, len);
}

describe("processFixedWidthLine", () => {
  test("parses a valid fixed-width line and applies per-type rules", () => {
    const line =
      pad("1234", 4) + // numeric
      pad("Alice", 10) + // string -> trimEnd
      pad("2023-09-01", 10); // date -> dd/mm/yyyy

    const cells = processFixedWidthLine(line, meta);
    expect(cells).toEqual(["1234", "Alice", "01/09/2023"]);
  });

  test("throws when line is too short for a column slice", () => {
    const line = pad("1234", 4) + pad("Alice", 10); // missing date slice
    expect(() => processFixedWidthLine(line, meta)).toThrow(
      /Data line too short/
    );
  });

  test("throws on string column containing CR/LF", () => {
    const bad = pad("1234", 4) + pad("bad\nline", 10) + pad("2023-01-02", 10);
    expect(() => processFixedWidthLine(bad, meta)).toThrow(
      /STRING_FORMAT_ERROR/
    );
  });

  test("throws on invalid date format", () => {
    const bad = pad("1234", 4) + pad("Alice", 10) + pad("20230901", 10);
    expect(() => processFixedWidthLine(bad, meta)).toThrow(/DATE_FORMAT_ERROR/);
  });

  test("throws on invalid numeric value", () => {
    const bad =
      pad("12a4", 4) + // not numeric
      pad("Alice", 10) +
      pad("2023-01-02", 10);
    expect(() => processFixedWidthLine(bad, meta)).toThrow(
      /NUMERIC_FORMAT_ERROR/
    );
  });

  test("throws when extra content remains after defined columns", () => {
    const line =
      pad("1234", 4) + pad("Alice", 10) + pad("2023-01-02", 10) + "EXTRA";
    expect(() => processFixedWidthLine(line, meta)).toThrow(
      /unexpected extra content/
    );
  });
});
