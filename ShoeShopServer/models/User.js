const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // 로그인 ID
  loginId: { type: String, required: true, unique: true },

  // 비밀번호
  password: { type: String, required: true },

  // 사용자 이름
  name: { type: String, required: true },

  // 역할
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
});

module.exports = mongoose.model("User", userSchema);
