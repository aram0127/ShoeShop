const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const Order = require("../models/Order");

// 관리자 권한 확인
const checkAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
  next();
};

// 이미지 업로드
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public/uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// 상품 등록 (POST /api/admin/products)
router.post(
  "/products",
  checkAdmin,
  upload.array("images"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        categories,
        materials,
        availableSizes,
        discountRate,
        saleStartDate,
        saleEndDate,
      } = req.body;

      const imagePaths = req.files.map((file) => `uploads/${file.filename}`);

      const newProduct = new Product({
        name,
        description,
        price: Number(price),
        categories: categories.split(","),
        materials: materials.split(","),
        availableSizes: availableSizes.split(",").map(Number),
        images: imagePaths,
        discountRate: Number(discountRate || 0),
        saleStartDate: saleStartDate || null,
        saleEndDate: saleEndDate || null,
      });

      await newProduct.save();
      res.status(201).json({ message: "상품 등록 완료", product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "상품 등록 실패" });
    }
  }
);

// 상품 수정 (PUT /api/admin/products/:id)
router.put("/products/:id", checkAdmin, async (req, res) => {
  try {
    const { availableSizes, discountRate, saleStartDate, saleEndDate } =
      req.body;

    let updateData = {};

    // 가용 사이즈 변경
    if (availableSizes) {
      updateData.availableSizes = availableSizes;
    }

    // 할인 정책 변경
    if (discountRate !== undefined) {
      updateData.discountRate = Number(discountRate);
      updateData.saleStartDate = saleStartDate || null;
      updateData.saleEndDate = saleEndDate || null;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: "상품 정보 수정 완료", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "수정 실패" });
  }
});

// 판매 현황 조회 (GET /api/admin/sales)
router.get("/sales", checkAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 날짜 필터 조건 생성
    let matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate)
        matchStage.createdAt.$lte = new Date(
          new Date(endDate).setHours(23, 59, 59)
        );
    }

    // 집계
    const salesStats = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json(salesStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "집계 오류" });
  }
});

module.exports = router;
