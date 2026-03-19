"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      style={isActive ? { color: "#ffffff" } : undefined}
      className={[
        "inline-flex min-h-12 items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all",
        isActive
          ? "bg-[var(--foreground)] !text-white"
          : "text-[rgba(24,33,28,0.84)] hover:bg-[rgba(24,33,28,0.06)]",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
