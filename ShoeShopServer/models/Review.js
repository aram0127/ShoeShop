const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  // 어떤 상품에 대한 리뷰인가
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  // 작성자
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String },

  // 별점
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  // 3. 후기 내용
  title: { type: String, required: true },
  content: { type: String, required: true },

  // 작성일
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
