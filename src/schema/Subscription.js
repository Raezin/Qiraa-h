export class Subscription {
  constructor({
    subscriptionId = null,
    type = "Basic",
    creditPerDay = 20,
    expiryDate = null
  } = {}) {
    this.subscriptionId = subscriptionId;
    this.type = type;
    this.creditPerDay = creditPerDay;
    this.expiryDate = expiryDate;
  }
}