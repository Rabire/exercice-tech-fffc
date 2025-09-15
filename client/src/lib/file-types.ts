import type { FileMetadata } from "@/hooks/use-file-upload";

// TODO: test this

export const getLowercaseName = (file: File | FileMetadata): string => {
  return (file instanceof File ? file.name : file.name).toLowerCase();
};

export const getExtension = (name: string): string => {
  if (!name.includes(".")) return "";
  return name.substring(name.lastIndexOf("."));
};

export const isDataFile = (obj: File | FileMetadata): boolean => {
  const type = obj instanceof File ? obj.type : obj.type;
  const name = getLowercaseName(obj);
  const ext = getExtension(name);
  return (
    type === "text/plain" ||
    ext === ".txt" ||
    ext === ".dat" ||
    // Allow extensionless as data file
    ext === ""
  );
};

export const isMetadataFile = (obj: File | FileMetadata): boolean => {
  const type = obj instanceof File ? obj.type : obj.type;
  const name = getLowercaseName(obj);
  const ext = getExtension(name);
  return type === "text/csv" || ext === ".csv";
};
