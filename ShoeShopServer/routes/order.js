const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// 주문하기 (POST /api/orders)
router.post("/", async (req, res) => {
  try {
    // 로그인 체크
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 장바구니 확인
    const cart = req.session.cart;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "장바구니가 비어있습니다." });
    }

    // 총 금액 계산
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 주문 데이터 생성
    const orderItems = cart.map((item) => ({
      product: item.productId,
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
      priceAtPurchase: item.price,
    }));

    const newOrder = new Order({
      user: req.session.user.id,
      items: orderItems,
      totalAmount: totalAmount,
    });

    await newOrder.save();

    // 상품 판매량(salesCount) 증가 처리
    for (const item of cart) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { salesCount: item.quantity },
      });
    }

    // 장바구니 비우기
    req.session.cart = [];

    req.session.save(() => {
      res.status(201).json({
        message: "주문이 완료되었습니다.",
        orderId: newOrder._id,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "주문 처리 중 오류 발생" });
  }
});

// 내 주문 내역 조회 (GET /api/orders)
router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const orders = await Order.find({ user: req.session.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
