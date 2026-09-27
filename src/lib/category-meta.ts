export const CATEGORY_META: Record<
  string,
  { label: string; badge: string }
> = {
  nom: { label: "isem", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  verbe: { label: "amyag", badge: "border-sky-200 bg-sky-50 text-sky-700" },
  adjectif: {
    label: "arbib",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  adverbe: {
    label: "anaw n yiferdisen",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
  },
  expression: {
    label: "tanfaliyin",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
  },
  autre: { label: "Autre", badge: "border-zinc-200 bg-zinc-100 text-zinc-600" },
};

export function categoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.autre;
}
