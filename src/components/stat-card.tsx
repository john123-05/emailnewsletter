type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.68)] p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[rgba(24,33,28,0.4)]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
        {value}
      </div>
      {detail ? (
        <p className="mt-2 text-sm leading-6 text-[rgba(24,33,28,0.6)]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
