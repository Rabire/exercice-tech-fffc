import { useProgressStepper } from "@/hooks/progress-context";
import DownloadStep from "./download-step";
import UploadZone from "./file-upload";
import LoadingConvertStep from "./loading-convert-step";
import ProgressStepper from "./progress-stepper";

const StepperContent = () => {
  const { activeStep } = useProgressStepper();

  return (
    <>
      <ProgressStepper className="max-w-2xl" />

      {activeStep === 0 && <UploadZone />}

      {activeStep === 1 && <LoadingConvertStep />}

      {activeStep === 2 && <DownloadStep />}
    </>
  );
};

export default StepperContent;
