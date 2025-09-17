import { useProgressStepper } from "@/hooks/progress-context";
import { AlertTriangleIcon, XCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

const LoadingStepError = () => {
  const { error, reset } = useProgressStepper();

  if (!error) return null;

  return (
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
  );
};

export default LoadingStepError;
