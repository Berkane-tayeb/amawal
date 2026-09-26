"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "@/lib/actions/auth";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form
      action={action}
      className="card space-y-5 p-6 shadow-xl shadow-zinc-900/5"
    >
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label htmlFor="username" className="label">
          Nom d&apos;utilisateur
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          placeholder="admin"
          className="input mt-1.5"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="input mt-1.5"
        />
      </div>

      {state?.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-3"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        <Link
          href="/"
          className="font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          ← Retour au dictionnaire
        </Link>
      </p>
    </form>
  );
}
