import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  eyebrow,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={[
        "rounded-[24px] border border-[var(--line)] bg-[rgba(255,250,242,0.84)] p-4 shadow-[0_12px_30px_rgba(24,33,28,0.04)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="mb-4 flex flex-col gap-1.5">
        {eyebrow ? (
          <div className="text-[10px] uppercase tracking-[0.18em] text-[rgba(24,33,28,0.38)]">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-6 text-[rgba(24,33,28,0.6)]">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}
