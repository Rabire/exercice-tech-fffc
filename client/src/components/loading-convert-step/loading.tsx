import { useProgressStepper } from "@/hooks/progress-context";
import { CheckCircleIcon, LoaderCircleIcon } from "lucide-react";

const LoadingStep = () => {
  const { error } = useProgressStepper();

  if (error) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircleIcon className="size-5 text-primary" />
          <span className="text-sm font-medium">Analyse du fichier source</span>
        </div>
        <span className="text-xs text-muted-foreground">Terminé</span>
      </div>

      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center space-x-3">
          <LoaderCircleIcon className="size-5 text-primary animate-spin" />
          <span className="text-sm font-medium">Conversion des données</span>
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
  );
};

export default LoadingStep;
