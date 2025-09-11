import { useProgressStepper } from "@/hooks/progress-context";
import UploadZone from "./file-upload";
import ProgressStepper from "./progress-stepper";

const StepperContent = () => {
  const { activeStep } = useProgressStepper();

  return (
    <>
      <ProgressStepper className="max-w-2xl" />

      {activeStep === 0 && <UploadZone />}
      {/* {activeStep === 1 && <ConvertZone />} */}
      {/* {activeStep === 2 && <DownloadZone />} */}
    </>
  );
};

export default StepperContent;
