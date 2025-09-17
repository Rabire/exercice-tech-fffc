import { type Metadata } from "../types.ts";
import { parseMetadataFromString } from "./parse-metadata-from-string.ts";

export async function parseMetadataFromBlob(blob: Blob): Promise<Metadata> {
  // Metadata is expected to be small; load fully in memory for simplicity and robustness
  const text = await blob.text();
  return parseMetadataFromString(text);
}
