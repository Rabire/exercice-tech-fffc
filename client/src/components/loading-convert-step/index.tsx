import LoadingStepError from "./error";
import LoadingStepHeader from "./header";
import LoadingStep from "./loading";

const LoadingConvertStep = () => {
  return (
    <div className="max-w-2xl w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Conversion en cours</h2>
        <p className="text-muted-foreground text-sm">
          Un instant s'il vous plaît...
        </p>
      </div>

      <div className="bg-card border rounded-xl p-6 space-y-6">
        <LoadingStepHeader />

        <LoadingStep />

        <LoadingStepError />
      </div>
    </div>
  );
};

export default LoadingConvertStep;
