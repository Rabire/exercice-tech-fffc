import { FileTextIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function UploadZone({ className }: Props) {
  const [
    {
      // files, // TODO: handle files in state
      isDragging,
      // errors // TODO: handle errors
    },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      // removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*", // Fix this, it should be text/* and other file types
  });

  return (
    <div
      role="button"
      onClick={openFileDialog}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-dragging={isDragging || undefined}
      className={cn(
        "border-muted-foreground data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px] bg-background cursor-pointer",
        className
      )}
    >
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload file"
      />
      <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
        <div
          className="bg-background mb-2 flex size-16 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <FileTextIcon className="size-6 opacity-60" />
        </div>

        <p className="mb-1.5 text-sm font-medium">
          Ajoutez ici un fichier de données et un fichier de métadonnées
        </p>
        <p className="text-muted-foreground text-xs">
          Déposez vos fichiers ici ou cliquez pour parcourir
        </p>
      </div>
    </div>
  );
}
