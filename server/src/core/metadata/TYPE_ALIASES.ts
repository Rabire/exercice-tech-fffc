import { type ColumnType } from "../types.ts";

// Centralized type alias mapping for metadata parsing
export const TYPE_ALIASES: Record<string, ColumnType> = {
  date: "date",
  // French
  numérique: "numeric",
  numerique: "numeric",
  numeric: "numeric",
  number: "numeric",
  // strings
  string: "string",
  chaine: "string",
  chaîne: "string",
  texte: "string",
};
