import { describe, expect, test } from "bun:test";
import { parseMetadataFromBlob } from "./index";

function makeBlob(text: string): Blob {
  return new Blob([text], { type: "text/plain" });
}

describe("parseMetadataFromBlob", () => {
  test("parses blob text and delegates to string parser", async () => {
    const blob = makeBlob("foo,3,string");
    const result = await parseMetadataFromBlob(blob);
    expect(result).toEqual({
      columns: [{ name: "foo", length: 3, type: "string" }],
    });
  });

  test("propagates errors from underlying parser", async () => {
    const blob = makeBlob("bar,1,bool");
    await expect(parseMetadataFromBlob(blob)).rejects.toThrow(
      /Unsupported column type: bool/
    );
  });
});
