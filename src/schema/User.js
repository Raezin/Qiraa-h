import { Subscription } from "./Subscription";

export class User {
  constructor({
    userId = null,
    name = "",
    email = "",
    role = "user",
    credits = 0,
    createdAt = null,
    lastLogin = null,
    subscription = {}
  } = {}) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.credits = credits;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;

    // Always normalize subscription
    this.subscription = new Subscription(subscription);
  }
}
