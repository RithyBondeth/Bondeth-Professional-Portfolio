/**
 * Lightweight hover affordance. Pointer-following GSAP work was decorative
 * and delayed hydration of the primary calls to action.
 */
export function Magnetic(props: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  innerSelector?: string;
  innerStrength?: number;
}) {
  return <div className={`magnetic-lite ${props.className ?? ""}`}>{props.children}</div>;
}
