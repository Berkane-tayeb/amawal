"use client";

import { useActionState } from "react";
import { createWord, updateWord, type WordFormState } from "@/lib/actions/words";
import { CATEGORIES } from "@/lib/categories";
import { CATEGORY_META } from "@/lib/category-meta";
import type { WordDTO } from "@/lib/words";

type Props = {
  mode: "create" | "edit";
  wordId?: string;
  initial?: WordDTO;
};

function FieldError({ state, field }: { state: WordFormState; field: string }) {
  const messages = state?.fieldErrors?.[field];
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{messages[0]}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
      {children}
      <span className="h-px flex-1 bg-zinc-200" />
    </h2>
  );
}

export function WordForm({ mode, wordId, initial }: Props) {
  const action =
    mode === "edit" && wordId ? updateWord.bind(null, wordId) : createWord;

  const [state, formAction, pending] = useActionState<WordFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="card animate-fade-up space-y-8 p-6 shadow-xl shadow-zinc-900/5 sm:p-8"
    >
      <section>
        <SectionTitle>Le mot</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="word" className="label">
              Mot (kabyle) <span className="text-red-500">*</span>
            </label>
            <input
              id="word"
              name="word"
              required
              defaultValue={initial?.word ?? ""}
              placeholder="ex. agadir"
              className="input mt-1.5"
            />
            <FieldError state={state} field="word" />
          </div>

          <div>
            <label htmlFor="transcription" className="label">
              Transcription (tifinagh)
            </label>
            <input
              id="transcription"
              name="transcription"
              defaultValue={initial?.transcription ?? ""}
              placeholder="ex. ⴰⴳⴰⴷⵉⵔ"
              className="input mt-1.5 font-mono"
            />
            <FieldError state={state} field="transcription" />
          </div>

          <div>
            <label htmlFor="phonetic" className="label">
              Phonétique (API)
            </label>
            <input
              id="phonetic"
              name="phonetic"
              defaultValue={initial?.phonetic ?? ""}
              placeholder="ex. /a.ɣa.diɾ/"
              className="input mt-1.5 font-mono"
            />
            <FieldError state={state} field="phonetic" />
          </div>

          <div>
            <label htmlFor="category" className="label">
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              defaultValue={initial?.category ?? "nom"}
              className="input mt-1.5 cursor-pointer"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_META[category]?.label ?? category}
                </option>
              ))}
            </select>
            <FieldError state={state} field="category" />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Définition</SectionTitle>
        <div>
          <label htmlFor="definition" className="label">
            Définition en kabyle <span className="text-red-500">*</span>
          </label>
          <textarea
            id="definition"
            name="definition"
            required
            rows={4}
            defaultValue={initial?.definition ?? ""}
            placeholder="Définition du mot…"
            className="input mt-1.5 resize-y"
          />
          <FieldError state={state} field="definition" />
        </div>
      </section>

      <section>
        <SectionTitle>Traductions</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="fr" className="label">
              Français
            </label>
            <input
              id="fr"
              name="fr"
              defaultValue={initial?.translations.fr ?? ""}
              placeholder="mur, rempart"
              className="input mt-1.5"
            />
            <FieldError state={state} field="fr" />
          </div>
          <div>
            <label htmlFor="ar" className="label">
              العربية
            </label>
            <input
              id="ar"
              name="ar"
              dir="rtl"
              defaultValue={initial?.translations.ar ?? ""}
              placeholder="سور"
              className="input mt-1.5"
            />
            <FieldError state={state} field="ar" />
          </div>
          <div>
            <label htmlFor="en" className="label">
              English
            </label>
            <input
              id="en"
              name="en"
              defaultValue={initial?.translations.en ?? ""}
              placeholder="wall"
              className="input mt-1.5"
            />
            <FieldError state={state} field="en" />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Exemples</SectionTitle>
        <div>
          <label htmlFor="examples" className="label">
            Un exemple par ligne
          </label>
          <textarea
            id="examples"
            name="examples"
            rows={3}
            defaultValue={initial?.examples.join("\n") ?? ""}
            placeholder={"Agadir ur ittizdmen ara.\n…"}
            className="input mt-1.5 resize-y font-mono text-sm"
          />
          <FieldError state={state} field="examples" />
        </div>
      </section>

      {state?.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary px-6 py-3"
        >
          {pending
            ? "Enregistrement…"
            : mode === "edit"
              ? "Mettre à jour"
              : "Ajouter le mot"}
        </button>
      </div>
    </form>
  );
}
