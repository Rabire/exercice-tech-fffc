import type { FileMetadata, FileWithPreview } from "@/hooks/use-file-upload";
import { isDataFile, isMetadataFile } from "@/lib/file-types";

// TODO: test this

export const buildUiState = (files: FileWithPreview[]) => {
  const hasData = files.some((f) => isDataFile(f.file as File | FileMetadata));

  const hasMeta = files.some((f) =>
    isMetadataFile(f.file as File | FileMetadata)
  );

  const invalidFiles = files.filter((f) => {
    const obj = f.file as File | FileMetadata;
    return !isDataFile(obj) && !isMetadataFile(obj);
  });

  const isValidCombo =
    files.length === 2 && hasData && hasMeta && invalidFiles.length === 0;

  return { hasData, hasMeta, invalidFiles, isValidCombo };
};

export const buildInvalidPairMessage = (
  files: FileWithPreview[]
): string | null => {
  const { hasData, hasMeta } = buildUiState(files);

  if (files.length === 2 && !(hasData && hasMeta))
    return "Vous devez fournir un fichier Fixed-Width (.txt, .dat ou sans extension) et un fichier de métadonnées (.csv)";

  return null;
};

export const buildInstructionText = (files: FileWithPreview[]): string => {
  const defaultText =
    "Ajoutez ici un fichier de données et un fichier de métadonnées";

  const { hasData, hasMeta } = buildUiState(files);

  if (files.length === 0) return defaultText;
  if (files.length === 2 && hasData && hasMeta) return defaultText;

  if (files.length === 1) {
    const obj = files[0].file as File | FileMetadata;

    if (isDataFile(obj)) return "Ajoutez le fichier de métadonnées (.csv)";

    if (isMetadataFile(obj))
      return "Ajoutez le fichier de données Fixed-Width (.txt, .dat ou sans extension)";
  }

  if (files.length === 2 && !(hasData && hasMeta))
    return "Ajoutez un fichier Fixed-Width et un fichier de métadonnées";

  return defaultText;
};

export const buildAcceptTypes = (files: FileWithPreview[]): string => {
  const { hasData, hasMeta } = buildUiState(files);

  if (hasData && !hasMeta) return ".csv";
  if (hasMeta && !hasData) return ".txt,.dat";
  return "*";
};
