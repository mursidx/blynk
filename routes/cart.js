const express = require("express");
const router = express.Router();
require("dotenv").config();
const { validateAdmin, userIsLoggedIn } = require("../middlewares/admin");
const { cartModel, validatecart } = require("../models/cart");
const { productModel } = require("../models/product");

router.get("/", userIsLoggedIn, async function (req, res) {
  try {
    let cart = await cartModel.find({ user: req.session.passport.user })
    res.send(cart)
  } catch (error) {
    res.send(error.message)

  }
});


router.get("/add/:id", userIsLoggedIn, async function (req, res) {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    if (!cart) {
      cart = await cartModel.create({
        user: req.session.passport.user,
        products: [req.params.id],
        totalprice: Number(product.price),
      });
    } else {
      cart.products.push(req.params.id);
      cart.totalprice = Number(cart.totalprice) + Number(product.price);
      await cart.save();
    }
    res.redirect("back");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/remove/:id", userIsLoggedIn, async function (req, res) {
  try {

    let cart = await cartModel.findOne({ user: req.session.passport.user })
    if (!cart) return res.send("Something went wrong while removing item")
    let index = cart.products.indexOf(req.params.id)
    if (index !== -1){
      cart.products.splice(index, 1)
    }else{
      return res.send('Item is not in the cart')
    }

    await cart.save()
    res.send(cart)

  } catch (error) {

    res.send(error.message)

  }
});

module.exports = router;