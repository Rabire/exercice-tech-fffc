import { type PropsWithChildren } from "react";

const BackgroundDecoration = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
      linear-gradient(to right, rgba(229,231,235,0.3) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(229,231,235,0.3) 1px, transparent 1px),
      radial-gradient(circle 500px at 20% 100%, rgba(139,92,246,0.2), transparent),
      radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.2), transparent)
      `,
        backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundDecoration;
