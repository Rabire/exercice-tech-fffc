import { useProgressStepper } from "@/hooks/progress-context";
import DownloadStep from "./download-step";
import UploadZone from "./file-upload";
import LoadingConvertStep from "./loading-convert-step";
import ProgressStepper from "./progress-stepper";

const StepperContent = () => {
  const { activeStep, error, downloadUrl } = useProgressStepper();

  return (
    <>
      <ProgressStepper className="max-w-2xl" />

      {activeStep === 0 && (
        <div className="max-w-2xl  space-y-6 w-full">
          <UploadZone />

          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {activeStep === 1 && <LoadingConvertStep />}

      {activeStep === 2 && <DownloadStep />}

      {/* Hidden auto-download anchor */}
      {activeStep === 2 && downloadUrl && (
        <a
          href={downloadUrl}
          download="output.csv"
          className="sr-only"
          aria-hidden
        >
          download
        </a>
      )}
    </>
  );
};

export default StepperContent;
