const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// 리뷰 작성 (POST /api/reviews)
router.post("/", async (req, res) => {
  try {
    const { productId, rating, title, content } = req.body;

    // 로그인 체크
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 구매 내역 확인
    const hasPurchased = await Order.findOne({
      user: req.session.user.id,
      "items.product": productId,
    });
    if (!hasPurchased) {
      return res
        .status(403)
        .json({ message: "구매한 상품에 대해서만 후기를 작성할 수 있습니다." });
    }

    // 리뷰 데이터 생성
    const newReview = new Review({
      product: productId,
      user: req.session.user.id,
      userName: req.session.user.name,
      rating: rating,
      title: title,
      content: content,
    });

    await newReview.save();

    res.status(201).json({ message: "후기가 등록되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "후기 등록 중 오류 발생" });
  }
});

// 특정 상품의 리뷰 목록 조회 (GET /api/reviews/:productId)
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
