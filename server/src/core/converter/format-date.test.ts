import { describe, expect, test } from "bun:test";
import { formatDateToDDMMYYYY } from "./format-date";

describe("formatDateToDDMMYYYY", () => {
  test("formats valid YYYY-MM-DD to DD/MM/YYYY", () => {
    expect(formatDateToDDMMYYYY("2023-09-01")).toBe("01/09/2023");
    expect(formatDateToDDMMYYYY("1999-12-31")).toBe("31/12/1999");
  });

  test("trims input before validation", () => {
    expect(formatDateToDDMMYYYY(" 2023-01-02 ")).toBe("02/01/2023");
  });

  test("throws on invalid formats", () => {
    expect(() => formatDateToDDMMYYYY("2023/01/02")).toThrow(
      /Invalid date format/
    );
    expect(() => formatDateToDDMMYYYY("2023-1-02")).toThrow();
    expect(() => formatDateToDDMMYYYY("hello")).toThrow();
    expect(() => formatDateToDDMMYYYY("")).toThrow();
  });
});
