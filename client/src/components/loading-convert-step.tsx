import { useProgressStepper } from "@/hooks/progress-context";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BugIcon,
  CheckCircleIcon,
  CogIcon,
  DatabaseIcon,
  FileTextIcon,
  LoaderCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { Button } from "./ui/button";

const LoadingConvertStep = () => {
  const { error, reset } = useProgressStepper();

  return (
    <div className="max-w-2xl w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Conversion en cours</h2>
        <p className="text-muted-foreground text-sm">
          Un instant s'il vous plaît...
        </p>
      </div>

      {/* Conversion Process Visualization */}
      <div className="bg-card border rounded-xl p-6 space-y-6">
        {/* Process Flow */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="bg-accent p-3 rounded-full">
              <FileTextIcon className="size-6 text-accent-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Fichier source</p>
              <p className="text-xs text-muted-foreground">Format original</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-4">
            <ArrowRightIcon className="size-4 text-muted-foreground" />
            {!error && (
              <div className="bg-primary p-2 rounded-full animate-pulse">
                <CogIcon className="size-4 text-primary-foreground animate-spin" />
              </div>
            )}

            {error && (
              <div className="bg-destructive p-2 rounded-full">
                <BugIcon className="size-4 text-destructive-foreground" />
              </div>
            )}
            <ArrowRightIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="bg-secondary p-3 rounded-full">
              <DatabaseIcon className="size-6 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Fichier converti</p>
              <p className="text-xs text-muted-foreground">Format cible</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        {!error && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="size-5 text-primary" />
                <span className="text-sm font-medium">
                  Analyse du fichier source
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Terminé</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <LoaderCircleIcon className="size-5 text-primary animate-spin" />
                <span className="text-sm font-medium">
                  Conversion des données
                </span>
              </div>
              <span className="text-xs text-muted-foreground">En cours...</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg opacity-60">
              <div className="flex items-center space-x-3">
                <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
                <span className="text-sm font-medium">
                  Validation et finalisation
                </span>
              </div>
              <span className="text-xs text-muted-foreground">En attente</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <XCircleIcon className="size-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-destructive">
                  Erreur de conversion
                </h3>
                <pre className="text-xs text-destructive/80 mt-1 whitespace-pre-line">
                  {error}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <AlertTriangleIcon className="size-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Vérifiez les formats de vos fichiers et réessayez
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" size="sm">
                Recommencer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingConvertStep;
