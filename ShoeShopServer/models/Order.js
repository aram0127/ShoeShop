const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // 주문자
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 지난 주문 내역 표시에 필요한 정보들
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      size: { type: Number, required: true },
      image: { type: String },

      // 주문 당시의 결제 가격
      priceAtPurchase: { type: Number, required: true },
    },
  ],

  // 총 결제 금액
  totalAmount: { type: Number, required: true },

  // 결제일
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
