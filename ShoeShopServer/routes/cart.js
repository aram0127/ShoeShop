const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 세션에서 장바구니 꺼내기 (없으면 빈 배열 초기화) (GET /api/cart)
router.get("/", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.json(req.session.cart);
});

// 장바구니 담기 (POST /api/cart)
router.post("/", async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    // 상품 정보 조회
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "상품 없음" });

    // 장바구니 초기화
    if (!req.session.cart) req.session.cart = [];
    const cart = req.session.cart;

    // 이미 담긴 상품인지 확인 (상품ID + 사이즈가 모두 같아야 함)
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // 이미 있으면 수량만 증가
      cart[existingItemIndex].quantity += quantity;
    } else {
      // 없으면 새로 추가
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.finalPrice,
        image: product.images[0],
        size: size,
        quantity: quantity,
      });
    }

    // 세션 저장 후 응답
    req.session.save(() => {
      res.json(cart);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "장바구니 오류" });
  }
});

// 장바구니 비우기 (DELETE /api/cart)
router.delete("/", (req, res) => {
  req.session.cart = [];
  req.session.save(() => res.json({ message: "장바구니 초기화" }));
});

// 특정 아이템 삭제 (DELETE /api/cart/:productId/:size)
router.delete("/:productId/:size", (req, res) => {
  const { productId, size } = req.params;
  if (!req.session.cart) return res.json([]);

  req.session.cart = req.session.cart.filter(
    (item) => !(item.productId === productId && item.size == size)
  );

  req.session.save(() => res.json(req.session.cart));
});

module.exports = router;
