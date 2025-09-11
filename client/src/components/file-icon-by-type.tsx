import type { FileMetadata } from "@/hooks/use-file-upload";
import { isDataFile, isMetadataFile } from "@/lib/file-types";
import { FileCogIcon, FileIcon, FileTextIcon } from "lucide-react";

export function FileIconByType(props: {
  file: File | FileMetadata;
  size?: string;
}) {
  const { file, size = "size-4" } = props;
  if (isDataFile(file))
    return <FileTextIcon className={`${size} opacity-60`} />;
  if (isMetadataFile(file))
    return <FileCogIcon className={`${size} opacity-60`} />;
  return <FileIcon className={`${size} opacity-60`} />;
}
