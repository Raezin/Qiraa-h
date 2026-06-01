// ============================================================
//  Review.js  —  Class + Mongoose Schema
// ============================================================

const { Schema, model } = require("mongoose");

/* ─────────────────────────────────────────
   CLASS
───────────────────────────────────────── */
class Review {
  /**
   * @param {string} reviewId
   * @param {string} userId
   * @param {number} rating     e.g. 1 – 5
   * @param {string} comment
   * @param {Date}   createdAt
   */
  constructor(reviewId, userId, rating, comment = "", createdAt = new Date()) {
    this.reviewId  = reviewId;
    this.userId    = userId;
    this.rating    = rating;
    this.comment   = comment;
    this.createdAt = createdAt;
  }

  // ── helpers ──────────────────────────────
  isPositive()  { return this.rating >= 4; }
  isNegative()  { return this.rating <= 2; }
  isNeutral()   { return this.rating === 3; }
  summary()     { return `[${this.rating}★] ${this.comment.slice(0, 60)}`; }
  toJSON()      { return { ...this }; }
}

/* ─────────────────────────────────────────
   MONGOOSE SCHEMA
───────────────────────────────────────── */
const reviewSchema = new Schema(
  {
    reviewId: {
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
    rating: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
    },
    comment: {
      type:    String,
      default: "",
      trim:    true,
      maxlength: 2000,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

const ReviewModel = model("Review", reviewSchema);

module.exports = { Review, ReviewModel, reviewSchema };