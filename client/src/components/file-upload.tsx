import { AlertCircleIcon, FileCogIcon, FileTextIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import {
  buildAcceptTypes,
  buildInstructionText,
  buildInvalidPairMessage,
  buildUiState,
} from "@/lib/messages";
import FileCard from "./file-card";

export default function UploadZone() {
  // TODO: move logic in a wrapper context for the multi-step feature
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles: 2,
    accept: ".txt,.dat,.csv,.xlsx,", // ends with comma to allow extensionless fixed-width files
  });

  // TODO: change style of icons when hover with corresponding file

  const invalidPairMessage = buildInvalidPairMessage(files);
  const uiError = errors.length > 0 ? errors[0] : invalidPairMessage;

  const { isValidCombo } = buildUiState(files);
  // TODO: if isValidCombo go to step 2

  const inputProps = getInputProps({
    accept: buildAcceptTypes(files),
    multiple: !isValidCombo,
    disabled: isValidCombo,
  });

  const instructionText = buildInstructionText(files);

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
        className="border-muted-foreground/80 h-80 bg-background hover:border-primary data-[dragging=true]:bg-accent has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] cursor-pointer"
      >
        <input {...inputProps} className="sr-only" aria-label="Upload files" />

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

          <p className="mb-1.5 text-sm font-medium">{instructionText}</p>
          <p className="text-muted-foreground mb-2 text-xs">
            Déposez vos fichiers ici ou cliquez pour parcourir{" "}
          </p>
        </div>
      </div>

      {(uiError?.length ?? 0) > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{uiError}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <FileCard key={file.id} file={file} removeFile={removeFile} />
          ))}
        </div>
      )}
    </div>
  );
}
