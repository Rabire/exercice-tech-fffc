import BackgroundDecoration from "./components/background-decoration";
import StepperContent from "./components/stepper-content";
import { ProgressStepperProvider } from "./hooks/progress-context";

function App() {
  return (
    <BackgroundDecoration>
      <main className="relative max-w-screen-xl mx-auto px-6 py-10 space-y-16 flex flex-col items-center">
        <div className="flex flex-col gap-6 items-center text-center">
          <h1 className="text-6xl font-bold leading-tight">
            Convertisseur de fichiers
            <br />
            Fixed-Width vers CSV
          </h1>

          <p className="text-xl text-muted-foreground">
            Transformez vos fichiers de données en CSV lisibles et exploitables
            en quelques clics.
          </p>
        </div>

        <ProgressStepperProvider>
          <StepperContent />
        </ProgressStepperProvider>
      </main>
    </BackgroundDecoration>
  );
}

export default App;
