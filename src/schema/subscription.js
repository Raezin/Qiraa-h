// ============================================================
//  Subscription.js  —  Class + Mongoose Schema
// ============================================================

const { Schema, model } = require("mongoose");

/* ─────────────────────────────────────────
   CLASS
───────────────────────────────────────── */
class Subscription {
  /**
   * @param {string} subscriptionId
   * @param {string} type            e.g. "free" | "basic" | "premium"
   * @param {number} creditPerDay
   * @param {Date}   expiryDate
   */
  constructor(subscriptionId, type, creditPerDay, expiryDate) {
    this.subscriptionId = subscriptionId;
    this.type           = type;
    this.creditPerDay   = creditPerDay;
    this.expiryDate     = new Date(expiryDate);
  }

  // ── helpers ──────────────────────────────
  isExpired()       { return new Date() > this.expiryDate; }
  isActive()        { return !this.isExpired(); }
  daysRemaining()   {
    const ms = this.expiryDate - new Date();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }
  toJSON() { return { ...this }; }
}

/* ─────────────────────────────────────────
   MONGOOSE SCHEMA
───────────────────────────────────────── */
const subscriptionSchema = new Schema(
  {
    subscriptionId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    type: {
      type:     String,
      required: true,
      enum:     ["free", "basic", "premium"],
      trim:     true,
    },
    creditPerDay: {
      type:     Number,
      required: true,
      min:      0,
    },
    expiryDate: {
      type:     Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: is the subscription still active?
subscriptionSchema.virtual("isActive").get(function () {
  return new Date() <= this.expiryDate;
});

const SubscriptionModel = model("Subscription", subscriptionSchema);

module.exports = { Subscription, SubscriptionModel, subscriptionSchema };