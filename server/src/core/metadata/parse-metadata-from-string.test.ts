import { describe, expect, test } from "bun:test";
import { parseMetadataFromString } from "./parse-metadata-from-string";

describe("parseMetadataFromString", () => {
  test("parses valid metadata with different line endings and trims BOM", () => {
    const text =
      "\uFEFFfirst_name,10,string\r\namount,8,numeric\ncreated_at,8,date";
    const result = parseMetadataFromString(text);
    expect(result).toEqual({
      columns: [
        { name: "first_name", length: 10, type: "string" },
        { name: "amount", length: 8, type: "numeric" },
        { name: "created_at", length: 8, type: "date" },
      ],
    });
  });

  test("supports quoted CSV values and trims cells", () => {
    const text = '"field with spaces" ,  4 ,  "string"';
    const result = parseMetadataFromString(text);
    expect(result.columns).toEqual([
      { name: "field with spaces", length: 4, type: "string" },
    ]);
  });

  test("throws when a row has not exactly 3 columns", () => {
    const text = "only_two,10";
    expect(() => parseMetadataFromString(text)).toThrow(/expected 3 columns/);
  });

  test("validates row with zod (invalid length)", () => {
    const text = "bad_length,not_a_number,string";
    expect(() => parseMetadataFromString(text)).toThrow(
      /Invalid metadata at line/
    );
  });

  test("validates row with zod (empty name)", () => {
    const text = ",10,string";
    expect(() => parseMetadataFromString(text)).toThrow(
      /Invalid metadata at line/
    );
  });

  test("validates type via normalizeType", () => {
    const text = "val,3,chaine";
    const result = parseMetadataFromString(text);
    expect(result.columns).toEqual([
      { name: "val", length: 3, type: "string" },
    ]);
  });

  test("throws when a type is unsupported", () => {
    const text = "a,1,bool";
    expect(() => parseMetadataFromString(text)).toThrow(
      /Unsupported column type: bool/
    );
  });

  test("returns empty columns when input is empty", () => {
    const text = "";
    expect(parseMetadataFromString(text)).toEqual({ columns: [] });
  });
});
