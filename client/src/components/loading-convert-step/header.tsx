import { useProgressStepper } from "@/hooks/progress-context";
import {
  ArrowRightIcon,
  BugIcon,
  CogIcon,
  DatabaseIcon,
  FileTextIcon,
} from "lucide-react";

const LoadingStepHeader = () => {
  const { error } = useProgressStepper();

  return (
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
  );
};

export default LoadingStepHeader;
