import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { useProgressStepper } from "@/hooks/progress-context";

const steps = [
  {
    step: 1,
    title: "Ajoutez vos fichiers",
  },
  {
    step: 2,
    title: "Convertissez vos fichiers",
  },
  {
    step: 3,
    title: "Téléchargez vos fichiers",
  },
];

type Props = {
  className?: string;
};

export default function ProgressStepper({ className }: Props) {
  const { activeStep, isStepLoading } = useProgressStepper();

  return (
    <Stepper value={activeStep + 1} className={className}>
      {steps.map(({ step, title }) => (
        <StepperItem
          key={step}
          step={step}
          className="relative flex-1 flex-col!"
          loading={isStepLoading}
        >
          <StepperTrigger className="flex-col gap-3 rounded">
            <StepperIndicator />
            <div className="space-y-0.5 px-2">
              <StepperTitle>{title}</StepperTitle>
            </div>
          </StepperTrigger>

          {step < steps.length && (
            <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
          )}
        </StepperItem>
      ))}
    </Stepper>
  );
}
