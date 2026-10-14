import type { CSSProperties } from "react";

/** CSS-only portrait lift that keeps the visual polish off the critical JS path. */
export function TiltCard(props: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  hoverScale?: number;
}) {
  const { children, className, glare = true, hoverScale = 1.015 } = props;
  const style = { "--tilt-scale": hoverScale } as CSSProperties;

  return (
    <div className={`tilt-card-lite ${className ?? ""}`} style={style}>
      {children}
      {glare && (
        <div
          aria-hidden
          className="tilt-card-glare pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        />
      )}
    </div>
  );
}
