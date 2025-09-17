import type { FileMetadata, FileWithPreview } from "@/hooks/use-file-upload";
import { isDataFile, isMetadataFile } from "@/lib/file-types";

// Select the data and meta files from the files array and throw an error if the files are invalid
const selectDataAndMeta = (
  files: FileWithPreview[]
): { data: File; meta: File } => {
  const dataWrapper = files.find((f) =>
    isDataFile(f.file as File as File | FileMetadata)
  );

  const metaWrapper = files.find((f) =>
    isMetadataFile(f.file as File as File | FileMetadata)
  );

  if (
    !(dataWrapper?.file instanceof File) ||
    !(metaWrapper?.file instanceof File)
  ) {
    throw new Error("Data or metadata file missing or invalid");
  }

  return { data: dataWrapper.file, meta: metaWrapper.file };
};

// Only build the form data if the files are valid
export const buildFormData = (files: FileWithPreview[]): FormData => {
  const { data, meta } = selectDataAndMeta(files);

  const fd = new FormData();
  fd.append("data", data);
  fd.append("metadata", meta);

  return fd;
};

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://api.ikki.rabire.com"
    : "http://localhost:3001";

export const convertToCsv = async (
  fd: FormData,
  signal: AbortSignal
): Promise<Blob> => {
  // FIXME: use the api base from the environment variable
  const res = await fetch(`${API_URL}/convert`, {
    method: "POST",
    body: fd,
    signal,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.blob();
};
