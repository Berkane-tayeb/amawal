import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import { WordForm } from "@/components/word-form";

export const metadata: Metadata = {
  title: "Nouveau mot",
};

export default async function NewWordPage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-zinc-900">
          Ajouter un mot
        </h2>
        <p className="text-sm text-zinc-500">
          Le mot, sa définition et ses traductions apparaîtront immédiatement
          dans le dictionnaire.
        </p>
      </div>
      <WordForm mode="create" />
    </div>
  );
}
