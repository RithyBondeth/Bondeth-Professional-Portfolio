import type { ReactNode } from "react";
import { SectionMascot, type TSectionMascot } from "@/components/mascot/section-mascot";
import styles from "@/components/mascot/mascot.module.css";

export function SectionHeading({ children, section, className, id }: {
  children: ReactNode;
  section: TSectionMascot;
  className?: string;
  id?: string;
}) {
  return (
    <h2 id={id} className={`reveal-heading ${styles.sectionHeading} ${className ?? ""}`}>
      <SectionMascot section={section} />
      <span className="min-w-0">{children}</span>
    </h2>
  );
}
