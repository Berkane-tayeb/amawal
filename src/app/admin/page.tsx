import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { listAllWords, type WordDTO } from "@/lib/words";
import { DeleteWordButton } from "@/components/delete-word-button";
import { categoryMeta } from "@/lib/category-meta";

export const dynamic = "force-dynamic";

function RowActions({ entry }: { entry: WordDTO }) {
  return (
    <div className="flex justify-end gap-2">
      <Link
        href={`/admin/${entry.id}`}
        className="btn-soft px-3 py-1.5 text-xs"
      >
        Modifier
      </Link>
      <DeleteWordButton id={entry.id} word={entry.word} />
    </div>
  );
}

export default async function AdminPage() {
  await requireAdmin();
  const entries = await listAllWords();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          <span className="font-bold text-zinc-800">{entries.length}</span>{" "}
          mot(s)
        </p>
        <Link
          href="/"
          className="text-sm font-semibold text-brand-700 hover:underline"
        >
          Voir le site →
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="card border-2 border-dashed border-brand-200 bg-brand-50/40 p-10 text-center sm:p-14">
          <p className="font-mono text-4xl text-brand-300">ⵣ</p>
          <p className="mt-4 font-bold text-zinc-700">
            Le dictionnaire est vide
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            <Link
              href="/admin/nouveau"
              className="font-semibold text-brand-700 underline underline-offset-4"
            >
              Ajoute le premier mot
            </Link>{" "}
            pour commencer.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="card animate-fade-up hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-zinc-400">
                  <th className="px-5 py-3.5">Mot</th>
                  <th className="px-5 py-3.5">Catégorie</th>
                  <th className="px-5 py-3.5">Définition</th>
                  <th className="px-5 py-3.5">Français</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const meta = categoryMeta(entry.category);

                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-zinc-100 transition last:border-0 hover:bg-brand-50/50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/mot/${entry.id}`}
                          className="font-bold text-zinc-900 hover:text-brand-700"
                        >
                          {entry.word}
                        </Link>
                        {entry.transcription && (
                          <span className="ml-2 font-mono text-xs text-zinc-400">
                            {entry.transcription}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`pill ${meta.badge}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="max-w-xs truncate px-5 py-4 text-zinc-600">
                        {entry.definition}
                      </td>
                      <td className="max-w-[14rem] truncate px-5 py-4 italic text-zinc-500">
                        {entry.translations.fr || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <RowActions entry={entry} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile : cartes empilées */}
          <ul className="space-y-3 md:hidden">
            {entries.map((entry, index) => {
              const meta = categoryMeta(entry.category);

              return (
                <li
                  key={entry.id}
                  className="card animate-fade-up p-4"
                  style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/mot/${entry.id}`}
                        className="font-bold text-zinc-900 hover:text-brand-700"
                      >
                        {entry.word}
                      </Link>
                      {entry.transcription && (
                        <span className="ml-2 font-mono text-xs text-zinc-400">
                          {entry.transcription}
                        </span>
                      )}
                      <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600">
                        {entry.definition}
                      </p>
                      {entry.translations.fr && (
                        <p className="mt-1 line-clamp-1 text-sm italic text-zinc-500">
                          {entry.translations.fr}
                        </p>
                      )}
                    </div>
                    <span className={`pill shrink-0 ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="mt-3 border-t border-zinc-100 pt-3">
                    <RowActions entry={entry} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
