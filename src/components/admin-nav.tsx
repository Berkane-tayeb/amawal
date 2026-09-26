"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Mots" },
  { href: "/admin/nouveau", label: "+ Nouveau mot" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 sm:w-auto">
      {TABS.map((tab) => {
        const active =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "flex-1 rounded-lg bg-white px-4 py-2 text-center text-sm font-bold text-brand-700 shadow-sm sm:flex-none"
                : "flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold text-zinc-500 transition hover:text-zinc-800 sm:flex-none"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
