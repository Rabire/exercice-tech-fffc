import { type ColumnType } from "../types.ts";
import { TYPE_ALIASES } from "./TYPE_ALIASES.ts";

export function normalizeType(raw: string): ColumnType {
  const key = raw.trim().toLowerCase();
  const mapped = TYPE_ALIASES[key];
  if (!mapped) throw new Error(`Unsupported column type: ${raw}`);
  return mapped;
}
