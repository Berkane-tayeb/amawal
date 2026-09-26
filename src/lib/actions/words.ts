"use server";

import { z } from "zod";
import { Types } from "mongoose";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Word, CATEGORIES } from "@/lib/models/word";
import { requireAdmin } from "@/lib/dal";

const WordSchema = z.object({
  word: z.string().trim().min(1, "Le mot est requis").max(100),
  transcription: z.string().trim().max(100).optional(),
  phonetic: z.string().trim().max(100).optional(),
  category: z.enum(CATEGORIES),
  definition: z.string().trim().min(1, "La définition est requise").max(2000),
  fr: z.string().trim().max(500).optional(),
  ar: z.string().trim().max(500).optional(),
  en: z.string().trim().max(500).optional(),
  examples: z.string().optional(),
});

export type WordFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

function parseForm(formData: FormData) {
  return WordSchema.safeParse({
    word: formData.get("word"),
    transcription: formData.get("transcription") || undefined,
    phonetic: formData.get("phonetic") || undefined,
    category: formData.get("category"),
    definition: formData.get("definition"),
    fr: formData.get("fr") || undefined,
    ar: formData.get("ar") || undefined,
    en: formData.get("en") || undefined,
    examples: formData.get("examples") || undefined,
  });
}

function toDoc(data: z.infer<typeof WordSchema>) {
  return {
    word: data.word,
    transcription: data.transcription || "",
    phonetic: data.phonetic || "",
    category: data.category,
    definition: data.definition,
    translations: { fr: data.fr || "", ar: data.ar || "", en: data.en || "" },
    examples: (data.examples || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  };
}

function invalidState(error: z.ZodError): WordFormState {
  return {
    error: "Veuillez corriger les champs en erreur.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export async function createWord(
  _prevState: WordFormState,
  formData: FormData,
): Promise<WordFormState> {
  await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) return invalidState(parsed.error);

  await connectDB();
  await Word.create(toDoc(parsed.data));

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateWord(
  id: string,
  _prevState: WordFormState,
  formData: FormData,
): Promise<WordFormState> {
  await requireAdmin();

  if (!Types.ObjectId.isValid(id)) {
    return { error: "Identifiant de mot invalide." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return invalidState(parsed.error);

  await connectDB();
  const updated = await Word.findByIdAndUpdate(id, toDoc(parsed.data), {
    new: true,
  });

  if (!updated) {
    return { error: "Mot introuvable." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/mot/${id}`);
  redirect("/admin");
}

export async function deleteWord(id: string): Promise<void> {
  await requireAdmin();

  if (!Types.ObjectId.isValid(id)) return;

  await connectDB();
  await Word.findByIdAndDelete(id);

  revalidatePath("/");
  revalidatePath("/admin");
}
