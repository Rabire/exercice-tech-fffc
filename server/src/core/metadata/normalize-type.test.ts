import { describe, expect, test } from "bun:test";
import { normalizeType } from "./normalize-type";

describe("normalizeType", () => {
  test("maps canonical types", () => {
    expect(normalizeType("date")).toBe("date");
    expect(normalizeType("numeric")).toBe("numeric");
    expect(normalizeType("string")).toBe("string");
  });

  test("is case-insensitive and trims", () => {
    expect(normalizeType("  DATE ")).toBe("date");
    expect(normalizeType("  Numeric")).toBe("numeric");
    expect(normalizeType("STRING  ")).toBe("string");
  });

  test("supports French aliases and common synonyms", () => {
    expect(normalizeType("numérique")).toBe("numeric");
    expect(normalizeType("numerique")).toBe("numeric");
    expect(normalizeType("number")).toBe("numeric");
    expect(normalizeType("chaine")).toBe("string");
    expect(normalizeType("chaîne")).toBe("string");
    expect(normalizeType("texte")).toBe("string");
  });

  test("throws on unsupported types", () => {
    expect(() => normalizeType("bool")).toThrow(
      /Unsupported column type: bool/
    );
    expect(() => normalizeType("")).toThrow();
    expect(() => normalizeType("  ")).toThrow();
  });
});
