import { z } from "zod";

const ColumnTypeSchema = z.enum(["date", "numeric", "string"]);

export const MetadataRowSchema = z.tuple([
  z.string().min(1, "column name required"),
  z.coerce.number().int().positive(),
  ColumnTypeSchema,
]);

export type ColumnType = z.infer<typeof ColumnTypeSchema>;

export interface ColumnSpec {
  name: string;
  length: number;
  type: ColumnType;
}

export const MetadataSchema = z.object({
  columns: z.array(
    z.object({
      name: z.string().min(1),
      length: z.number().int().positive(),
      type: ColumnTypeSchema,
    })
  ),
});

export type Metadata = z.infer<typeof MetadataSchema>;
