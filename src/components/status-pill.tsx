import type { ReactNode } from "react";

type StatusPillProps = {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const toneClasses: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  neutral:
    "border-[rgba(24,33,28,0.12)] bg-[rgba(24,33,28,0.06)] text-[rgba(24,33,28,0.72)]",
  success:
    "border-[rgba(45,107,87,0.18)] bg-[rgba(45,107,87,0.12)] text-[var(--success)]",
  warning:
    "border-[rgba(170,106,31,0.18)] bg-[rgba(170,106,31,0.12)] text-[var(--warning)]",
  danger:
    "border-[rgba(163,62,57,0.18)] bg-[rgba(163,62,57,0.12)] text-[var(--danger)]",
  info: "border-[rgba(154,95,63,0.18)] bg-[rgba(154,95,63,0.12)] text-[var(--accent)]",
};

export function StatusPill({
  children,
  tone = "neutral",
}: StatusPillProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
