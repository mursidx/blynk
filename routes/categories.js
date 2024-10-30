const express = require("express");
const router = express.Router();
require("dotenv").config();
const validateAdmin = require("../middlewares/admin");
const { categoryModel, validatecategory } = require("../models/category");

router.post("/", validateAdmin, async function (req, res) {
  let category = await categoryModel.create({ name: req.body.name });

  res.redirect("back")
});

module.exports = router;
