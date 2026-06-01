// ============================================================
//  User.js  —  Class + Mongoose Schema
// ============================================================

const { Schema, model } = require("mongoose");

/* ─────────────────────────────────────────
   CLASS
───────────────────────────────────────── */
class User {
  /**
   * @param {string} userId
   * @param {string} name
   * @param {string} email
   * @param {"user"|"admin"} role
   * @param {number} credits
   * @param {string} subscriptionId
   * @param {Date}   createdAt
   * @param {Date}   lastLogin
   */
  constructor(userId, name, email, role = "user", credits = 0, subscriptionId = null, createdAt = new Date(), lastLogin = new Date()) {
    this.userId         = userId;
    this.name           = name;
    this.email          = email;
    this.role           = role;           // "user" or "admin"
    this.credits        = credits;
    this.subscriptionId = subscriptionId;
    this.createdAt      = createdAt;
    this.lastLogin      = lastLogin;
  }

  // ── helpers ──────────────────────────────
  isAdmin()           { return this.role === "admin"; }
  deductCredits(n)    { this.credits = Math.max(0, this.credits - n); }
  addCredits(n)       { this.credits += n; }
  updateLastLogin()   { this.lastLogin = new Date(); }
  toJSON() {
    return { ...this };
  }
}

/* ─────────────────────────────────────────
   MONGOOSE SCHEMA
───────────────────────────────────────── */
const userSchema = new Schema(
  {
    userId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
      match:    [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
    credits: {
      type:    Number,
      default: 0,
      min:     0,
    },
    subscriptionId: {
      type:    String,
      default: null,
    },
    lastLogin: {
      type:    Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

const UserModel = model("User", userSchema);

module.exports = { User, UserModel, userSchema };