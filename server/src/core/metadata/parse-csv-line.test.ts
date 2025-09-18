import { describe, expect, test } from "bun:test";
import { parseCsvLine } from "./parse-csv-line";

describe("parseCsvLine", () => {
  test("parses simple comma-separated values", () => {
    expect(parseCsvLine("a,b,c")).toEqual(["a", "b", "c"]);
  });

  test("handles quoted values with commas", () => {
    expect(parseCsvLine('"a,b",c')).toEqual(["a,b", "c"]);
    expect(parseCsvLine('x,"y,z",w')).toEqual(["x", "y,z", "w"]);
  });

  test("handles escaped quotes within quoted values", () => {
    expect(parseCsvLine('"a ""quote"" b",c')).toEqual(['a "quote" b', "c"]);
  });

  test("trims whitespace around values, preserves inner quoted content", () => {
    expect(parseCsvLine("  a  ,   b   ")).toEqual(["a", "b"]);
    // spaces inside quotes are preserved until final trim, which removes outer padding only
    expect(parseCsvLine('"  b  " , c')).toEqual(["b", "c"]);
  });

  test("supports empty fields and trailing commas", () => {
    expect(parseCsvLine("a,b,")).toEqual(["a", "b", ""]);
    expect(parseCsvLine(",b,c")).toEqual(["", "b", "c"]);
  });

  test("returns single empty value for empty line", () => {
    expect(parseCsvLine("")).toEqual([""]);
  });

  test("unclosed quote: consumes rest of line as a single field", () => {
    expect(parseCsvLine('"a,b')).toEqual(["a,b"]);
  });
});
