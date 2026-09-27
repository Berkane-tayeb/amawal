import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Connexion",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : "";

  return (
    <div className="mx-auto grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
      <aside className="card relative animate-fade-up hidden overflow-hidden border-0 bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800 p-8 text-white shadow-xl shadow-brand-700/25 md:flex md:flex-col md:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-amber-300/20 blur-2xl"
        />

        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/25 backdrop-blur">
            ⵣ
          </span>
          <h2 className="mt-6 text-2xl font-extrabold leading-snug">
            Espace d&apos;administration
            <span className="block font-mono text-base font-medium text-brand-100">
              ⴰⵎⴰⵡⴰⵍ ⴰⵖⵓⵔⴱⵉⵣ
            </span>
          </h2>
        </div>

        <ul className="relative mt-8 space-y-3 text-sm text-brand-50">
          <li className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Ajouter et modifier les mots du dictionnaire
          </li>
          <li className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Gérer tabadut, taseddast, agdazal et amedya
          </li>
          <li className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Accès réservé aux administrateurs
          </li>
        </ul>
      </aside>

      <div className="animate-pop">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Connexion
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Bienvenue sur le backoffice d&apos;Amawal aɣurbiz.
        </p>
        <div className="mt-5">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
