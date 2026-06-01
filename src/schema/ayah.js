// ============================================================
//  Ayah.js  —  Class + Mongoose Schema
// ============================================================

const { Schema, model } = require("mongoose");

/* ─────────────────────────────────────────
   CLASS
───────────────────────────────────────── */
class Ayah {
  /**
   * @param {string} ayahId
   * @param {string} text     Arabic text of the verse
   * @param {string} surah    Surah name or number (stored as string)
   * @param {number} number   Ayah number within the Surah
   */
  constructor(ayahId, text, surah, number) {
    this.ayahId = ayahId;
    this.text   = text;
    this.surah  = surah;
    this.number = number;
  }

  // ── helpers ──────────────────────────────
  /** Returns a short human-readable reference like "Al-Fatiha : 1" */
  reference() { return `${this.surah} : ${this.number}`; }

  /** Word count of the ayah text */
  wordCount()  { return this.text.trim().split(/\s+/).length; }

  toJSON() { return { ...this }; }
}

/* ─────────────────────────────────────────
   MONGOOSE SCHEMA
───────────────────────────────────────── */
const ayahSchema = new Schema(
  {
    ayahId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    text: {
      type:     String,
      required: true,
      trim:     true,
    },
    surah: {
      type:     String,
      required: true,
      trim:     true,
    },
    number: {
      type:     Number,
      required: true,
      min:      1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: quickly look up any verse by surah + number
ayahSchema.index({ surah: 1, number: 1 }, { unique: true });

const AyahModel = model("Ayah", ayahSchema);

module.exports = { Ayah, AyahModel, ayahSchema };