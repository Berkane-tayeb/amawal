import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";

export async function SiteHeader() {
  const user = await verifySession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white shadow-md shadow-brand-600/30 transition-transform group-hover:scale-105">
            ⵣ
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-tight text-zinc-900 group-hover:text-brand-700">
              Amawal
            </span>
            <span className="hidden font-mono text-[0.68rem] text-brand-600/80 sm:block">
              ⴰⵎⴰⵡⴰⵍ
            </span>
          </span>
        </Link>

        <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 text-sm">
          <Link
            href="/"
            className="hidden rounded-full px-3.5 py-2 font-medium text-zinc-600 transition hover:bg-brand-50 hover:text-brand-700 sm:inline-block"
          >
            Dictionnaire
          </Link>

          {user?.role === "admin" ? (
            <>
              <Link
                href="/admin"
                className="rounded-full px-3 py-2 font-medium text-zinc-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <span className="hidden sm:inline">Backoffice</span>
                <span className="sm:hidden">Admin</span>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  aria-label="Se déconnecter"
                  className="btn-soft rounded-full px-3 py-2"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v10a1.5 1.5 0 0 0 1.5 1.5h6A1.5 1.5 0 0 0 13 15v-2M8.5 10H17m0 0-2.5-2.5M17 10l-2.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="btn-primary rounded-full px-4 py-2"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
