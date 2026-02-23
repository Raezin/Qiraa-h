export class Review {
  constructor({
    reviewId = null,
    userId = null,
    rating = 0,
    comment = "",
    createdAt = null
  } = {}) {
    this.reviewId = reviewId;
    this.userId = userId;
    this.rating = Math.max(0, Math.min(5, rating));
    this.comment = comment;
    this.createdAt = createdAt || Date.now();
  }
}
