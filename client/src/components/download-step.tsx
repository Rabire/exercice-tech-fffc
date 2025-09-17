import { useProgressStepper } from "@/hooks/progress-context";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

const DownloadStep = () => {
  const { downloadUrl, fileUploadState, error, reset } = useProgressStepper();
  const [{ files, errors: uploadErrors }] = fileUploadState;

  const handleDownloadCsv = () => {
    const a = document.createElement("a");
    a.href = downloadUrl ?? "";
    a.download = "output.csv";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadOriginals = () => {
    if (!files || files.length === 0) return;

    files.forEach((f) => {
      const maybeFile = f.file as File;
      const isRealFile = maybeFile instanceof File;
      const url = isRealFile ? URL.createObjectURL(maybeFile) : f.preview || "";
      if (!url) return;

      const a = document.createElement("a");
      a.href = url;
      a.download = isRealFile ? maybeFile.name : "file";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (isRealFile) URL.revokeObjectURL(url);
    });
  };

  const allErrors = [...(uploadErrors ?? []), ...(error ? [error] : [])];

  return (
    <div className="w-full space-y-6 max-w-2xl">
      <div
        className="bg-emerald-50 text-emerald-900 border-emerald-200 border rounded-md p-3 flex items-center justify-center gap-2"
        role="status"
      >
        <p className="text-sm text-center">
          Conversion terminée.
          <br />
          Vous pouvez télécharger le fichier CSV.
        </p>
      </div>

      {allErrors.length > 0 && (
        <div
          className="bg-red-50 text-red-900 border-red-200 border rounded-md p-3"
          role="alert"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="size-4" />
            <span className="text-sm font-medium">Erreurs détectées</span>
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1">
            {allErrors.map((e, i) => (
              <li key={`${i}-${e}`}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex sm:flex-row flex-col justify-center gap-2">
        <Button
          variant="outline"
          onClick={handleDownloadOriginals}
          disabled={(files?.length ?? 0) === 0}
        >
          Télécharger les fichiers originaux
        </Button>

        <Button onClick={handleDownloadCsv}>
          Télécharger le fichier converti (csv)
        </Button>
      </div>

      <Button className="mx-auto block" onClick={reset}>
        Recommencer
      </Button>
    </div>
  );
};

export default DownloadStep;
