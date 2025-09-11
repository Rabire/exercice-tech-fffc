import { XIcon } from "lucide-react";

import { FileIconByType } from "@/components/file-icon-by-type";
import { Button } from "@/components/ui/button";
import {
  formatBytes,
  type FileMetadata,
  type FileWithPreview,
} from "@/hooks/use-file-upload";

type Props = {
  file: FileWithPreview;
  removeFile: (id: string) => void;
};

const FileCard = ({ file, removeFile }: Props) => {
  return (
    <div className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
          <FileIconByType file={file.file as File | FileMetadata} />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-[13px] font-medium">
            {file.file instanceof File ? file.file.name : file.file.name}
          </p>
          <p className="text-muted-foreground text-xs">
            {formatBytes(
              file.file instanceof File ? file.file.size : file.file.size
            )}
          </p>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
        onClick={() => removeFile(file.id)}
        aria-label="Remove file"
      >
        <XIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default FileCard;
