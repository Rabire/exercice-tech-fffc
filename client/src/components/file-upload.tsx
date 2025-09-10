import {
  AlertCircleIcon,
  FileCogIcon,
  FileIcon,
  FileTextIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";

const getFileIcon = (file: { file: File | { type: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;

  if (fileType.includes("txt"))
    return <FileTextIcon className="size-4 opacity-60" />;

  if (fileType.includes("csv"))
    return <FileCogIcon className="size-4 opacity-60" />;

  return <FileIcon className="size-4 opacity-60" />;
};

export default function UploadZone() {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles: 2,
    accept: ".txt,.csv", // TODO: check if this is working
  });

  // TODO: change style of icons when hover with corresponding file

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-muted-foreground/80 h-80 bg-background hover:border-primary data-[dragging=true]:bg-accent has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-row -space-x-4">
            {/* .txt file */}
            <div
              className="bg-background mb-2 flex size-16 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <FileTextIcon className="size-6 opacity-60" />
            </div>

            {/* .csv file */}
            <div
              className="bg-background mb-2 flex size-16 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <FileCogIcon className="size-6 opacity-60" />
            </div>
          </div>

          <p className="mb-1.5 text-sm font-medium">
            Ajoutez ici un fichier de données et un fichier de métadonnées
          </p>
          <p className="text-muted-foreground mb-2 text-xs">
            Déposez vos fichiers ici ou cliquez pour parcourir{" "}
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                  {getFileIcon(file)}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file instanceof File
                      ? file.file.name
                      : file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(
                      file.file instanceof File
                        ? file.file.size
                        : file.file.size
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
          ))}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div>
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Remove all files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
