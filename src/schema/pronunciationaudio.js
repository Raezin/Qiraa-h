// ============================================================
//  PronunciationAudio.js  —  Class + Mongoose Schema
// ============================================================

const { Schema, model } = require("mongoose");

/* ─────────────────────────────────────────
   CLASS
───────────────────────────────────────── */
class PronunciationAudio {
  /**
   * @param {string} audioId
   * @param {string} evaluationId  The evaluation this audio was generated for
   * @param {string} audioUrl      URL / path to the audio file
   * @param {Date}   createdAt
   */
  constructor(audioId, evaluationId, audioUrl, createdAt = new Date()) {
    this.audioId       = audioId;
    this.evaluationId  = evaluationId;
    this.audioUrl      = audioUrl;
    this.createdAt     = createdAt;
  }

  // ── helpers ──────────────────────────────
  /** Derive file extension from the URL */
  fileExtension() {
    const parts = this.audioUrl.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "unknown";
  }

  /** Check whether the URL points to an MP3 */
  isMp3() { return this.fileExtension() === "mp3"; }

  toJSON() { return { ...this }; }
}

const pronunciationAudioSchema = new Schema(
  {
    audioId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    evaluationId: {
      type:     String,
      ref:      "Evaluation",
      required: true,
    },
    audioUrl: {
      type:     String,
      required: true,
      trim:     true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

pronunciationAudioSchema.index({ evaluationId: 1 });

const PronunciationAudioModel = model("PronunciationAudio", pronunciationAudioSchema);

module.exports = { PronunciationAudio, PronunciationAudioModel, pronunciationAudioSchema };