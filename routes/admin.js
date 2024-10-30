const express = require("express");
const router = express.Router();
require("dotenv").config();
const { adminModel } = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../models/admin");
const { func } = require("joi");
const validateAdmin = require('../middlewares/admin')

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

    let token = jwt.sign({ email: "admin@blynk.com" }, process.env.JWT_SECRET);
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
    let token = jwt.sign({ email: "admin@blynk.com" }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.redirect("/admin/dashboard");
  }
});

router.get('/dashboard', validateAdmin, function(req, res){
  res.render('admin_dashboard')
})
router.get('/logout', validateAdmin, function(req, res){
  res.cookie("token", "");
  res.redirect('/')
})
module.exports = router;
