const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 로그인 (POST /api/auth/login)
router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 아이디입니다." });
    }

    // 비밀번호 확인
    if (user.password !== password) {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }

    // 세션에 사용자 정보 저장
    req.session.user = {
      id: user._id,
      loginId: user.loginId,
      name: user.name,
      role: user.role,
    };

    // 세션 저장 후 응답
    req.session.save(() => {
      res.json({ message: "로그인 성공", user: req.session.user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 로그인 상태 확인 (GET /api/auth/check)
router.get("/check", (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// 로그아웃 (POST /api/auth/logout)
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });
    res.clearCookie("connect.sid");
    res.json({ message: "로그아웃 성공" });
  });
});

module.exports = router;
