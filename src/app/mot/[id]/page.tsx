import Link from "next/link";
import { notFound } from "next/navigation";
import { getWordById } from "@/lib/words";
import { categoryMeta } from "@/lib/category-meta";
import { SpeakButton } from "@/components/speak-button";

export const dynamic = "force-dynamic";

const TRANSLATIONS: Array<{
  key: "fr" | "ar";
  label: string;
  badge: string;
  dir?: "rtl";
}> = [
  {
    key: "fr",
    label: "s tefransist",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    key: "ar",
    label: "s ta3rabt",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    dir: "rtl",
  },
];

export default async function WordPage(props: PageProps<"/mot/[id]">) {
  const { id } = await props.params;
  const entry = await getWordById(id);
  if (!entry) notFound();

  const meta = categoryMeta(entry.category);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:gap-2.5"
      >
        ← Retour au dictionnaire
      </Link>

      <header className="card animate-fade-up relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-brand-50 p-8 shadow-xl shadow-brand-600/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-gradient-to-br from-brand-300/40 to-amber-200/40 blur-3xl"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex flex-wrap items-baseline gap-x-3 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
              {entry.word}
              {entry.phonetic && (
                <span className="font-mono text-base font-normal text-zinc-500">
                  {entry.phonetic}
                </span>
              )}
            </h1>
            {entry.transcription && (
              <p className="mt-1 font-mono text-xl text-brand-600">
                {entry.transcription}
              </p>
            )}
            {entry.syntax && (
              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                {entry.syntax}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className={`pill px-3 py-1 text-xs ${meta.badge}`}>
              {meta.label}
            </span>
            <SpeakButton text={entry.word} variant="button" />
          </div>
        </div>
      </header>

      <section className="card animate-fade-up p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
          tabadut
        </h2>
        <p className="mt-3 border-l-4 border-brand-400 pl-4 text-lg leading-relaxed text-zinc-800">
          {entry.definition}
        </p>
      </section>

      {entry.examples.length > 0 && (
        <section className="animate-fade-up">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
            amedya
          </h2>
          <ul className="space-y-3">
            {entry.examples.map((example, index) => (
              <li
                key={index}
                className="card flex items-start gap-4 border-l-4 border-l-amber-400 p-5"
              >
                <span className="font-mono text-2xl leading-none text-amber-300">
                  “
                </span>
                <p className="text-[0.98rem] leading-relaxed text-zinc-700">
                  {example}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {TRANSLATIONS.some((t) => entry.translations[t.key]) && (
        <section className="animate-fade-up">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
            Agdazal
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TRANSLATIONS.filter((t) => entry.translations[t.key]).map(
              (translation) => (
                <div
                  key={translation.key}
                  className="card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`pill ${translation.badge}`}>
                    {translation.label}
                  </span>
                  <p
                    className="mt-2.5 font-semibold text-zinc-800"
                    dir={translation.dir}
                  >
                    {entry.translations[translation.key]}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </article>
  );
}
