import { type PropsWithChildren } from "react";

const BackgroundDecoration = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          radial-gradient(125% 125% at 50% 30%, #ffffff 40%, #1b5e20 100%)
        `,
        backgroundSize: "100% 100%",
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundDecoration;
