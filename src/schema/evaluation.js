// ============================================================
//  Evaluation.js  —  Class + Mongoose Schema
// ============================================================

const { Schema, model } = require("mongoose");

/* ─────────────────────────────────────────
   CLASS
───────────────────────────────────────── */
class Evaluation {
  /**
   * @param {string} evaluationId
   * @param {string} userId
   * @param {string} ayahId
   * @param {string} transcription   ASR output text
   * @param {Array}  errors          JSON array of Tajweed / pronunciation error objects
   * @param {number} creditsUsed
   * @param {Date}   createdAt
   */
  constructor(
    evaluationId,
    userId,
    ayahId,
    transcription,
    errors       = [],
    creditsUsed  = 0,
    createdAt    = new Date()
  ) {
    this.evaluationId  = evaluationId;
    this.userId        = userId;
    this.ayahId        = ayahId;
    this.transcription = transcription;
    this.errors        = errors;        // stored internally as an Array
    this.creditsUsed   = creditsUsed;
    this.createdAt     = createdAt;
  }

  // ── helpers ──────────────────────────────
  /** Serialise errors array to a JSON string (matches DB column type) */
  errorsToJSON()   { return JSON.stringify(this.errors); }

  /** True when no Tajweed errors were detected */
  isPerfect()      { return this.errors.length === 0; }

  /** Count errors by severity level, if errors carry a `severity` field */
  countBySeverity(severity) {
    return this.errors.filter(e => e.severity === severity).length;
  }

  toJSON() {
    return { ...this, errors: this.errorsToJSON() };
  }
}

/* ─────────────────────────────────────────
   MONGOOSE SCHEMA
───────────────────────────────────────── */
const evaluationSchema = new Schema(
  {
    evaluationId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    userId: {
      type:     String,
      ref:      "User",
      required: true,
    },
    ayahId: {
      type:     String,
      ref:      "Ayah",
      required: true,
    },
    transcription: {
      type:     String,
      required: true,
    },
    /**
     * errors is stored as a JSON string in the UML diagram.
     * We store it as Mixed so callers can pass either a
     * stringified JSON or a plain array — the pre-save hook normalises it.
     */
    errors: {
      type:    Schema.Types.Mixed,
      default: "[]",
    },
    creditsUsed: {
      type:    Number,
      default: 0,
      min:     0,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Normalise errors to a JSON string before saving
evaluationSchema.pre("save", function (next) {
  if (Array.isArray(this.errors)) {
    this.errors = JSON.stringify(this.errors);
  }
  next();
});

// Virtual: parse errors back into an array for application use
evaluationSchema.virtual("parsedErrors").get(function () {
  try {
    return typeof this.errors === "string" ? JSON.parse(this.errors) : this.errors;
  } catch {
    return [];
  }
});

evaluationSchema.index({ userId: 1, createdAt: -1 });
evaluationSchema.index({ ayahId: 1 });

const EvaluationModel = model("Evaluation", evaluationSchema);

module.exports = { Evaluation, EvaluationModel, evaluationSchema };