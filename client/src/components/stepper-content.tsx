import { useProgressStepper } from "@/hooks/progress-context";
import DownloadStep from "./download-step";
import UploadZone from "./file-upload";
import LoadingConvertStep from "./loading-convert-step";
import ProgressStepper from "./progress-stepper";
import { Button } from "./ui/button";

const StepperContent = () => {
  const { activeStep } = useProgressStepper();

  return (
    <>
      <ProgressStepper className="max-w-2xl" />

      {activeStep === 0 && (
        <div className="max-w-2xl  space-y-6 w-full">
          <UploadZone />

          {/* TODO: plug the feature bellow */}
          <div className="flex flex-col gap-2 items-center">
            <p className="text-sm text-muted-foreground">
              Pas de données à convertir ? Générez les à l'aide de l'IA
            </p>
            <Button size="sm" variant="outline">
              Générer des données
            </Button>
          </div>
        </div>
      )}

      {activeStep === 1 && <LoadingConvertStep />}

      {activeStep === 2 && <DownloadStep />}
    </>
  );
};

export default StepperContent;
