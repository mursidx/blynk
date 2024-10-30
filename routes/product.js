const express = require("express");
const router = express.Router();
require("dotenv").config();
const validateAdmin = require('../middlewares/admin')
const { productModel, validateProduct } = require("../models/product");
let { categoryModel, validateCategory } = require("../models/category");
const upload = require("../config/multer_config");

router.get("/", async function (req, res) {
  let prods = await productModel.find();
  res.send(prods);
});

router.get("/delete/:id", validateAdmin ,async function (req, res) {
  if(req.user.admin){
    let prods = await productModel.findOneAndDelete({_id: req.params.id});
    return res.redirect('/admin/products');
  }
  res.send('You are not admin and not allowed to delete this product')
});

router.get("/update/:id", validateAdmin ,async function (req, res) {
  if(req.user.admin){
    let prods = await productModel.findOneAndUpdate({_id: req.params.id});
    return res.redirect('/admin/products');
  }
  res.send('You are not admin and not allowed to delete this product')
});





router.post("/delete", validateAdmin ,async function (req, res) {
  if(req.user.admin){
    let prods = await productModel.findOneAndDelete({_id: req.body.product_id});
    return res.redirect("back");
  }
  res.send('You are not admin and not allowed to delete this product')
});

router.post("/", upload.single("image"), async function (req, res) {
  let { name, price, category, stock, description, image } = req.body;

  let { error } = validateProduct({
    name,
    price,
    category,
    stock,
    description,
    image,
  });

  if (error) return res.send(error.message);

  let isCategory = await categoryModel.findOne({ name: category });
  if(!isCategory){
    let categoryCreated = await categoryModel.create({name: category})
  }

  let product = await productModel.create({
    name,
    price,
    category,
    stock,
    description,
    image: req.file.buffer,
  });

  res.redirect('/admin/products')
});

module.exports = router;
