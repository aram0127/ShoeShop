const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    categories: [
      {
        type: String,
        enum: ["lifestyle", "slipon"],
      },
    ],

    material: {
      type: String,
      enum: ["wool", "tree", "cotton", "canvas", "leather"],
    },

    availableSizes: [
      {
        type: Number,
        enum: [250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300],
      },
    ],

    images: [{ type: String }],

    discountRate: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    saleStartDate: { type: Date },
    saleEndDate: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 신제품 여부 (1달 이내)
productSchema.virtual("isNewProduct").get(function () {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return this.createdAt >= oneMonthAgo;
});

// 세일 중 여부 (기간 및 할인율 확인)
productSchema.virtual("onSale").get(function () {
  const now = new Date();
  return (
    this.discountRate > 0 &&
    (!this.saleStartDate || this.saleStartDate <= now) &&
    (!this.saleEndDate || this.saleEndDate >= now)
  );
});

// 최종 판매가 (할인 적용가)
productSchema.virtual("finalPrice").get(function () {
  return Math.round(this.price * (1 - this.discountRate / 100));
});

module.exports = mongoose.model("Product", productSchema);
