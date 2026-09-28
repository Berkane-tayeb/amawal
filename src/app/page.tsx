import Link from "next/link";
import { searchWords, countWords, type WordDTO } from "@/lib/words";
import { categoryMeta } from "@/lib/category-meta";
import { SpeakButton } from "@/components/speak-button";
import { SearchBar } from "@/components/search-bar";

export const dynamic = "force-dynamic";

function WordCard({ entry, index }: { entry: WordDTO; index: number }) {
  const meta = categoryMeta(entry.category);

  return (
    <div
      className="card group relative animate-fade-up p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-600/10"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-baseline gap-x-2 text-xl font-extrabold tracking-tight text-zinc-900">
            <Link
              href={`/mot/${entry.id}`}
              className="transition after:absolute after:inset-0 group-hover:text-brand-700"
            >
              {entry.word}
            </Link>
            {entry.phonetic && (
              <span className="font-mono text-xs font-normal text-zinc-400">
                {entry.phonetic}
              </span>
            )}
          </h3>
          {entry.transcription && (
            <p className="mt-0.5 font-mono text-sm text-brand-600">
              {entry.transcription}
            </p>
          )}
          {entry.syntax && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
              {entry.syntax}
            </p>
          )}
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-2">
          <span className={`pill ${meta.badge}`}>{meta.label}</span>
          <SpeakButton text={entry.word} />
        </div>
      </div>

      <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
        {entry.definition}
      </p>

      {entry.translations.fr && (
        <p className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
            s tefransist
          </span>
          <span className="truncate italic">{entry.translations.fr}</span>
        </p>
      )}
    </div>
  );
}

export default async function HomePage(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const letter = typeof searchParams.letter === "string" ? searchParams.letter : "";

  const [entries, total] = await Promise.all([
    searchWords({ q, letter }),
    countWords(),
  ]);

  return (
    <div className="space-y-10">
      <section className="card relative animate-fade-up overflow-hidden border-0 bg-gradient-to-br from-white via-white to-brand-50/60 p-8 shadow-xl shadow-brand-600/5 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-brand-300/40 to-amber-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-gradient-to-tr from-sky-200/50 to-brand-200/40 blur-3xl"
        />

        <div className="relative">
          <span className="pill border-brand-200 bg-brand-50 text-brand-700">
            Dictionnaire tamazight – tamazight
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            Amawal aɣurbiz{" "}
            <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text font-mono text-transparent">
              ⴰⵎⴰⵡⴰⵍ ⴰⵖⵓⵔⴱⵉⵣ
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-zinc-600">
            Snumel tutlayt tamaziɣt : tibadutin, tisqimin d yimedyaten,{" "}
            <span className="font-semibold text-brand-700">
              {total} n wawalen
            </span>{" "}
            d ugar ara tafeḍ.
          </p>

          <SearchBar q={q} letter={letter} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-extrabold tracking-tight text-zinc-800">
            {q
              ? `Résultats pour « ${q} »`
              : letter
                ? `Mots commençant par « ${letter} »`
                : "Akk wawalen"}
          </h2>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-zinc-500 ring-1 ring-zinc-200">
            {entries.length}
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="card border-dashed p-12 text-center">
            <p className="font-mono text-3xl text-zinc-300">ⵣ</p>
            <p className="mt-3 font-semibold text-zinc-600">
              Aucun mot trouvé
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Essaie une autre recherche ou parcours l&apos;alphabet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => (
              <WordCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
