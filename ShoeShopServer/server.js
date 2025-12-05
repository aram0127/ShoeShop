const express = require("express");
const session = require("express-session");
const memorystore = require("memorystore");
const MemoryStore = memorystore(session);
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const productRouter = require("./routes/product");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 정적 파일 제공 설정 (이미지 서빙용)
app.use(express.static("public"));

// 세션 설정
const maxAge = 1000 * 60 * 60;
app.use(
  session({
    secret: "shoe_shop_key",
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: {
      maxAge: maxAge,
      httpOnly: true,
      secure: false,
    },
  })
);

// 라우터 등록 (API 주소 연결)
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

// DB 연결 및 서버 실행
mongoose
  .connect("mongodb://127.0.0.1:27017/shoeshop")
  .then(() => {
    console.log("DB Connected");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed", err);
  });
