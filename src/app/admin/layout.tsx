import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { verifySession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Backoffice",
};

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await verifySession();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-zinc-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
            Backoffice
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Connecté en tant que{" "}
            <span className="font-semibold text-brand-700">
              {user?.username}
            </span>
          </p>
        </div>
        <AdminNav />
      </div>
      {children}
    </div>
  );
}
