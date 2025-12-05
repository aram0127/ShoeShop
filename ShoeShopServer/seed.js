const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const fixedProducts = require("./products_data.json");

mongoose
  .connect("mongodb://127.0.0.1:27017/shoeshop")
  .then(() => {
    console.log("DB Connected");
    seedData();
  })
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});

    await User.insertMany([
      { loginId: "customer", password: "123", name: "고객", role: "customer" },
      { loginId: "admin", password: "123", name: "관리자", role: "admin" },
    ]);

    const cleanProducts = fixedProducts.map((item) => {
      const { _id, ...rest } = item;
      if (rest.createdAt)
        rest.createdAt = new Date(rest.createdAt.$date || rest.createdAt);
      if (rest.saleStartDate)
        rest.saleStartDate = new Date(
          rest.saleStartDate.$date || rest.saleStartDate
        );
      if (rest.saleEndDate)
        rest.saleEndDate = new Date(rest.saleEndDate.$date || rest.saleEndDate);
      return rest;
    });

    await Product.insertMany(cleanProducts);
    console.log(
      `Successfully added ${cleanProducts.length} products from JSON file`
    );
  } catch (err) {
    console.error("Seeding Failed:", err);
  } finally {
    mongoose.disconnect();
    console.log("DB Disconnected.");
  }
};
