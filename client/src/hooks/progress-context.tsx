import { buildUiState } from "@/lib/messages";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  useFileUpload,
  type FileUploadActions,
  type FileUploadState,
} from "./use-file-upload";

type Type = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  fileUploadState: [FileUploadState, FileUploadActions];
  isStepLoading: boolean;
  setIsStepLoading: (isLoading: boolean) => void;
  isValidCombo: boolean;
};

const defaultValues: Type = {
  activeStep: 0,
  setActiveStep: () => null,
  fileUploadState: [{}, {}] as [FileUploadState, FileUploadActions],
  isStepLoading: false,
  setIsStepLoading: () => null,
  isValidCombo: false,
};

const ProgressStepperContext = createContext<Type>(defaultValues);

const ProgressStepperProvider = ({ children }: PropsWithChildren) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isStepLoading, setIsStepLoading] = useState(false);

  const fileUploadState = useFileUpload({
    multiple: true,
    maxFiles: 2,
    accept: ".txt,.dat,.csv,", // ends with comma to allow extensionless fixed-width files
  });

  const [{ files }] = fileUploadState;

  const { isValidCombo } = buildUiState(files);

  const value: Type = {
    activeStep,
    setActiveStep,
    fileUploadState,
    isStepLoading,
    setIsStepLoading,
    isValidCombo,
  };

  // ↓ None context values below this line (internal logic) ↓

  useEffect(() => {
    if (isValidCombo) {
      setIsStepLoading(true);

      setTimeout(() => {
        // TODO: mocked upload time
        setActiveStep(1);
        setIsStepLoading(false);
      }, 2000);
    }
  }, [isValidCombo]);

  useEffect(() => {
    // TODO: mocked processing time of data conversion. Replace with actual api call
    if (activeStep === 1) {
      setIsStepLoading(true);

      setTimeout(() => {
        setActiveStep(2);
        setIsStepLoading(false);
      }, 3000);
    }
  }, [activeStep]);

  return (
    <ProgressStepperContext.Provider value={value}>
      {children}
    </ProgressStepperContext.Provider>
  );
};

const useProgressStepper = () => {
  const context = useContext(ProgressStepperContext);

  return context;
};

export { ProgressStepperProvider, useProgressStepper };
