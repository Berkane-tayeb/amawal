import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CATEGORIES } from "@/lib/categories";

export { CATEGORIES };

const WordSchema = new Schema(
  {
    word: { type: String, required: true, trim: true, index: true },
    transcription: { type: String, trim: true },
    phonetic: { type: String, trim: true },
    category: { type: String, enum: CATEGORIES, default: "autre" },
    definition: { type: String, required: true, trim: true },
    translations: {
      fr: { type: String, trim: true },
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
    examples: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

WordSchema.index({ word: 1, definition: 1 });

export type WordDoc = InferSchemaType<typeof WordSchema> & { _id: unknown };

export const Word: Model<WordDoc> = models.Word ?? model("Word", WordSchema);
