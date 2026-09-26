import "server-only";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Word, type WordDoc } from "@/lib/models/word";

export type WordDTO = {
  id: string;
  word: string;
  transcription: string;
  phonetic: string;
  category: string;
  definition: string;
  translations: { fr: string; ar: string; en: string };
  examples: string[];
  createdAt?: Date;
};

export const ALPHABET = [
  "A", "B", "C", "Č", "D", "Ḍ", "E", "Ɛ", "F", "G", "Ɣ", "H", "I",
  "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "Š", "T", "Ṭ",
  "U", "V", "W", "X", "Y", "Z",
];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function toDTO(doc: WordDoc): WordDTO {
  return {
    id: String(doc._id),
    word: doc.word,
    transcription: doc.transcription ?? "",
    phonetic: doc.phonetic ?? "",
    category: doc.category ?? "autre",
    definition: doc.definition,
    translations: {
      fr: doc.translations?.fr ?? "",
      ar: doc.translations?.ar ?? "",
      en: doc.translations?.en ?? "",
    },
    examples: doc.examples ?? [],
    createdAt: doc.createdAt,
  };
}

export async function searchWords(params: { q?: string; letter?: string }) {
  await connectDB();

  const q = params.q?.trim();
  const letter = params.letter?.trim();
  const filter: Record<string, unknown> = {};

  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [
      { word: rx },
      { definition: rx },
      { phonetic: rx },
      { "translations.fr": rx },
      { "translations.ar": rx },
      { "translations.en": rx },
    ];
  } else if (letter) {
    filter.word = new RegExp(`^${escapeRegex(letter)}`, "i");
  }

  const docs = await Word.find(filter)
    .sort({ word: 1 })
    .limit(300)
    .lean();

  return docs.map((d) => toDTO(d as unknown as WordDoc));
}

export async function listAllWords() {
  await connectDB();
  const docs = await Word.find().sort({ word: 1 }).lean();
  return docs.map((d) => toDTO(d as unknown as WordDoc));
}

export async function getWordById(id: string): Promise<WordDTO | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doc = await Word.findById(id).lean();
  if (!doc) return null;
  return toDTO(doc as unknown as WordDoc);
}

export async function countWords() {
  await connectDB();
  return Word.countDocuments();
}
