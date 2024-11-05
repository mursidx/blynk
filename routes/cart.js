const express = require("express");
const router = express.Router();
require("dotenv").config();
const { validateAdmin, userIsLoggedIn } = require("../middlewares/admin");
const { cartModel, validatecart } = require("../models/cart");
const { productModel } = require("../models/product");
const {userModel} = require('../models/user')

router.get("/", userIsLoggedIn, async function (req, res) {
  try {
    let userid = req.session.passport.user;
    let user = await userModel.findOne({ _id: userid });
    let cart = await cartModel
      .findOne({ user: req.session.passport.user })
      .populate("products");

    let cartDataStructure = {};

    // Count the products in the cart
    cart.products.forEach((product) => {
      let key = String(product._id);
      if (cartDataStructure[key]) {
        cartDataStructure[key].quantity += 1;
      } else {
        // Initialize the entry if it doesn't exist
        cartDataStructure[key] = {
          ...product._doc || product, // Use product._doc if available, otherwise use product directly
          quantity: 1,
        };
      }
    });

    let finalarray = Object.values(cartDataStructure);

    // Calculate the cart count
    let cartCount = finalarray.reduce((total, product) => total + product.quantity, 0);

    // Render the cart view with cart count
    res.render("cart", { cart: finalarray, finalprice: cart.totalprice, userid, user, cartCount });
  } catch (error) {
    res.send(error.message);
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
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    if (!cart) return res.send("Something went wrong while removing item")
 
    let index = cart.products.indexOf(req.params.id);
    if (index !== -1) {
      cart.products.splice(index, 1);
    } else {
      return res.send("Item is not in the cart");
    }
    cart.totalprice = Number(cart.totalprice) - Number(product.price);

    await cart.save();
    res.redirect("back");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
