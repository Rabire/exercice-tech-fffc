import { buildFormData, convertToCsv } from "@/lib/conversion";
import { buildUiState } from "@/lib/messages";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  reset: () => void;
  error: string | null;
  downloadUrl: string | null;
};

const defaultValues: Type = {
  activeStep: 0,
  setActiveStep: () => null,
  fileUploadState: [{}, {}] as [FileUploadState, FileUploadActions],
  isStepLoading: false,
  setIsStepLoading: () => null,
  isValidCombo: false,
  reset: () => null,
  error: null,
  downloadUrl: null,
};

const ProgressStepperContext = createContext<Type>(defaultValues);

const ProgressStepperProvider = ({ children }: PropsWithChildren) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fileUploadState = useFileUpload({
    multiple: true,
    maxFiles: 2,
    accept: ".txt,.dat,.fw,.csv,", // ends with comma to allow extensionless fixed-width files
  });

  const [{ files }] = fileUploadState;

  const { isValidCombo } = buildUiState(files);

  const resetDownload = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  }, [downloadUrl]);

  const startConversion = useCallback(async () => {
    // Clear any previous error state and cleanup old download URLs
    setError(null);
    resetDownload();

    // Validate files and build request payload
    const formData = buildFormData(files);

    // Transition to loading state
    setIsStepLoading(true);
    setActiveStep(1);

    // Setup cancellation mechanism for the network request
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // Execute conversion via API call
      const blob = await convertToCsv(formData, controller.signal);

      // Create downloadable URL and transition to success state
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setActiveStep(2);
    } catch (err) {
      // Normalize error handling - convert all errors to Error instances
      const e = err instanceof Error ? err : new Error(String(err));

      // Only handle actual errors, ignore user cancellations
      if (e.name !== "AbortError") {
        setError(e.message);
        setActiveStep(0); // Reset to upload step
      }
    } finally {
      // Always cleanup loading state and controller reference
      setIsStepLoading(false);
      controllerRef.current = null;
    }
  }, [files, resetDownload]);

  // Create a unique signature based on file names and sizes to detect file changes
  // This triggers conversion restart when files are added, removed, or replaced
  const signature = useMemo(
    () =>
      files
        .map((f) => (f.file as File).name + ":" + (f.file as File).size)
        .sort()
        .join("|"),
    [files]
  );

  useEffect(() => {
    // Cancel any ongoing conversion when files change BEFORE starting a new one
    if (
      controllerRef.current &&
      controllerRef.current.signal.aborted === false
    ) {
      controllerRef.current.abort();
    }

    // Auto-start conversion when valid files are uploaded
    if (isValidCombo) void startConversion();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();

      resetDownload();
    };
  }, [resetDownload]);

  const reset = () => {
    setActiveStep(0);
    setIsStepLoading(false);
    setError(null);
    resetDownload();
    if (controllerRef.current) controllerRef.current.abort();
    const [, actions] = fileUploadState;
    actions.clearFiles();
  };

  const value: Type = {
    activeStep,
    setActiveStep,
    fileUploadState,
    isStepLoading,
    setIsStepLoading,
    isValidCombo,
    reset,
    error,
    downloadUrl,
  };

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
