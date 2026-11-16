import type { Dictionary } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

export function ProjectSummary({
  role,
  result,
  labels,
  className,
}: {
  role?: string | null;
  result: string;
  labels: Pick<Dictionary["projects"], "myRole" | "outcome">;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-2 border-l-2 border-primary/30 pl-3 text-xs leading-relaxed",
        className,
      )}
    >
      {role && (
        <div>
          <dt className="font-medium text-muted-foreground">{labels.myRole}</dt>
          <dd className="font-semibold text-foreground">{role}</dd>
        </div>
      )}
      <div>
        <dt className="font-medium text-muted-foreground">{labels.outcome}</dt>
        <dd className="font-semibold text-foreground">{result}</dd>
      </div>
    </dl>
  );
}
