import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db";
import { User } from "../src/lib/models/user";
import { Word } from "../src/lib/models/word";

const SAMPLE_WORDS = [
  {
    word: "agadir",
    phonetic: "/a.ɣa.diɾ/",
    transcription: "ⴰⴳⴰⴷⵉⵔ",
    category: "nom",
    definition:
      "Ameksum n tegesti d uḍris i ibanen ɣer tuddart neɣ ɣer tagaddagt n tigawt.",
    translations: { fr: "mur, rempart", ar: "سور", en: "wall, rampart" },
    examples: ["Agadir n taddart yeṭṭebbin tirga."],
  },
  {
    word: "azul",
    phonetic: "/a.zul/",
    transcription: "ⴰⵣⵓⵍ",
    category: "expression",
    definition: "Awal n tisra i yettwaqbaylen deg tulawin.",
    translations: { fr: "salut, bonjour", ar: "مرحبًا", en: "hello, hi" },
    examples: ["Azul fell-kem !"],
  },
  {
    word: "taddart",
    phonetic: "/tad.daɾt/",
    transcription: "ⵜⴰⴷⴷⴰⵔⵜ",
    category: "nom",
    definition:
      "Tigawt neɣ agru n tegesti yellan di wadda n yimḍan.",
    translations: { fr: "village, hameau", ar: "قرية", en: "village" },
    examples: ["Taddart-nsin tella d lawya ɣer temdint."],
  },
  {
    word: "amawal",
    phonetic: "/a.ma.wal/",
    transcription: "ⴰⵎⴰⵡⴰⵍ",
    category: "nom",
    definition:
      "Agbur n wawalen n yiwenniyan i d-yettwaskedden ɣer tira neɣ ɣer tawalint.",
    translations: { fr: "dictionnaire, lexique", ar: "قاموس", en: "dictionary" },
    examples: ["Amawal-agi yegd asqim n taqbaylit."],
  },
  {
    word: "issa",
    phonetic: "/is.sa/",
    transcription: "ⵉⵙⵙⴰ",
    category: "verbe",
    definition: "S-wali timeẓẓuɣin n uẓru, ma d tagi n tira.",
    translations: { fr: "vouloir, désirer", ar: "يريد", en: "to want" },
    examples: ["Issaɣ ad d-ruḥeɣ ɣer taddart."],
  },
  {
    word: "ẓẓer",
    phonetic: "/ðˤ.ðˤer/",
    transcription: "ⵥⵥⴻⵔ",
    category: "verbe",
    definition: "Hdu ɣer wayen i yellan s tezzwit n yebdan.",
    translations: { fr: "voir, regarder", ar: "يُنظر، يرى", en: "to see, to look" },
    examples: ["Ẓriɣ aṭṭas n yimiḍuren."],
  },
];

async function seed() {
  await connectDB();

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const existing = await User.findOne({ username }).lean();
  if (existing) {
    console.log(`Utilisateur admin « ${username} » déjà présent.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash, role: "admin" });
    console.log(`Admin créé : ${username} / ${password} (à changer !)`);
  }

  const count = await Word.countDocuments();
  if (count > 0) {
    console.log(`Le dictionnaire contient déjà ${count} mot(s), seed ignoré.`);
  } else {
    await Word.insertMany(SAMPLE_WORDS);
    console.log(`${SAMPLE_WORDS.length} mots d'exemple insérés.`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
