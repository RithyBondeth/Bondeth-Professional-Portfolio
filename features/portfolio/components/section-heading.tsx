import type { ReactNode } from "react";
import {
  SectionMascot,
  type MascotSection,
} from "@/shared/components/mascot/section-mascot";
import styles from "@/shared/components/mascot/mascot.module.css";

export function SectionHeading({
  children,
  section,
  className,
  id,
}: {
  children: ReactNode;
  section: MascotSection;
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={`reveal-heading ${styles.sectionHeading} ${className ?? ""}`}
    >
      <SectionMascot section={section} />
      <span className="min-w-0">{children}</span>
    </h2>
  );
}
