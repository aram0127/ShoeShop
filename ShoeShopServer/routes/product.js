const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 상품 목록 조회 (GET /api/products)
router.get("/", async (req, res) => {
  try {
    const { category, material, sizes, isNew, onSale } = req.query;

    // DB 쿼리 필터 객체 생성
    let filter = {};

    // [필터 1] 카테고리
    if (category) {
      filter.categories = category;
    }

    // [필터 2] 소재
    if (material) {
      const materialList = material.split(",");
      filter.material = { $in: materialList };
    }

    // [필터 3] 사이즈
    if (sizes) {
      const sizeList = sizes.split(",").map(Number);
      filter.availableSizes = { $in: sizeList };
    }

    // [필터 4] 신제품
    if (isNew === "true") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filter.createdAt = { $gte: oneMonthAgo };
    }

    // [필터 5] 세일 상품 (할인율 > 0 AND 기간 유효)
    if (onSale === "true") {
      const now = new Date();
      filter.discountRate = { $gt: 0 };
      filter.$and = [
        { $or: [{ saleStartDate: null }, { saleStartDate: { $lte: now } }] },
        { $or: [{ saleEndDate: null }, { saleEndDate: { $gte: now } }] },
      ];
    }

    // DB 조회 실행
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 상품 상세 조회 (GET /api/products/:id)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
