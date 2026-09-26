import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { getWordById } from "@/lib/words";
import { WordForm } from "@/components/word-form";

export const metadata: Metadata = {
  title: "Modifier un mot",
};

export default async function EditWordPage(props: PageProps<"/admin/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const entry = await getWordById(id);
  if (!entry) notFound();

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-zinc-900">
            Modifier « {entry.word} »
          </h2>
          <p className="text-sm text-zinc-500">
            Modifie les champs puis valide pour mettre à jour le dictionnaire.
          </p>
        </div>
        <Link
          href={`/mot/${entry.id}`}
          className="btn-soft shrink-0 self-start px-3 py-1.5 text-xs sm:self-auto"
        >
          Voir la fiche
        </Link>
      </div>
      <WordForm mode="edit" wordId={entry.id} initial={entry} />
      <Link
        href="/admin"
        className="inline-block text-sm font-semibold text-brand-700 hover:underline"
      >
        ← Retour à la liste
      </Link>
    </div>
  );
}
