export const CATEGORIES = [
  "nom",
  "verbe",
  "adjectif",
  "adverbe",
  "expression",
  "autre",
] as const;

export type Category = (typeof CATEGORIES)[number];
