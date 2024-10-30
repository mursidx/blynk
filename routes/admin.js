const express = require("express");
const router = express.Router();
require("dotenv").config();
const { adminModel } = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../models/admin");
const { func } = require("joi");
const validateAdmin = require("../middlewares/admin");
const { productModel } = require("../models/product");
let { categoryModel, validateCategory } = require("../models/category");

router.get("/create", async function (req, res) {
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPass = await bcrypt.hash("admin", salt);

    let user = new adminModel({
      name: "Mursid",
      email: "admin@blynk.com",
      password: hashedPass,
      role: "admin",
    });
    await user.save();

    let token = jwt.sign({ email: "admin@blynk.com", admin: true }, process.env.JWT_SECRET);
    res.cookie(token);
    res.send("Admin Created Successfully");
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/login", function (req, res) {
  res.render("admin_login");
});

router.post("/login", async function (req, res) {
  let { email, password } = req.body;
  let admin = await adminModel.findOne({ email });
  if (!admin) return res.send("This admin is not availabel");

  let valid = await bcrypt.compare(password, admin.password);
  if (valid) {
    let token = jwt.sign(
      { email: "admin@blynk.com", admin: true },
      process.env.JWT_SECRET
    );
    res.cookie("token", token);
    res.redirect("/admin/dashboard");
  }
});

router.get("/dashboard", validateAdmin, async function (req, res) {
  let prodcount = await productModel.find().countDocuments(); 
  let categcount = await categoryModel.find().countDocuments();

  res.render("admin_dashboard", {prodcount, categcount});
});
router.get("/logout", validateAdmin, function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});

router.get("/products", validateAdmin, async function (req, res) {
  const resultArray = await productModel.aggregate([
    {
      $group: {
        _id: "$category",
        products: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        products: { $slice: ["$products", 10] },
      },
    },
  ]);

  // Convert the array into an object
  const resultObject = resultArray.reduce((acc, item) => {
    acc[item.category] = item.products;
    return acc;
  }, {});

  res.render("admin_products", { products: resultObject });
});

module.exports = router;
