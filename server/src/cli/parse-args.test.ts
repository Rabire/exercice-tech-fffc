import { describe, expect, test } from "bun:test";
import { parseArgs } from "./parse-args";

describe("parseArgs", () => {
  test("returns empty object for no args", () => {
    expect(parseArgs([])).toEqual({});
  });

  test("parses --data", () => {
    expect(parseArgs(["--data", "path/to/data.txt"])).toEqual({
      data: "path/to/data.txt",
    });
  });

  test("parses --metadata", () => {
    expect(parseArgs(["--metadata", "meta.csv"])).toEqual({
      metadata: "meta.csv",
    });
  });

  test("parses --output", () => {
    expect(parseArgs(["--output", "out.csv"])).toEqual({ output: "out.csv" });
  });

  test("sets help when --help is present", () => {
    expect(parseArgs(["--help"])).toEqual({ help: true });
  });

  test("sets help when -h is present", () => {
    expect(parseArgs(["-h"])).toEqual({ help: true });
  });

  test("ignores positional arguments", () => {
    expect(
      parseArgs(["positional", "--data", "d.txt", "another-positional"])
    ).toEqual({ data: "d.txt" });
  });

  test("handles multiple flags together", () => {
    expect(
      parseArgs(["--data", "d.txt", "--metadata", "m.csv", "--output", "o.csv"])
    ).toEqual({ data: "d.txt", metadata: "m.csv", output: "o.csv" });
  });

  test("missing value after flag results in undefined for that key (current behavior)", () => {
    // Current implementation uses argv[++i]; if value is missing it becomes undefined
    expect(parseArgs(["--data"])).toEqual({ data: undefined });
  });
});
