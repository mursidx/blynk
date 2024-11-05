require("dotenv").config();
const express = require("express"); // Ensure express is required
const { func } = require("joi");
const { paymentModel } = require("../models/payment");
const { orderModel } = require("../models/order");
const { cartModel } = require("../models/cart");
const { userModel } = require("../models/user");
const { productModel } = require("../models/product");
const router = express.Router(); // Create a router instance

router.get(
  "/:userid/:orderid/:paymentid/:signature",
  async function (req, res) {
    let user = await userModel.findOne({ _id: req.params.userid });
    let address = user.address;
    let paymentDetails = await paymentModel.findOne({
      orderId: req.params.orderid,
    });

    if (!paymentDetails) return res.send("Sorry, Payment is Unsuccessful");

    // Check for both signature and payment ID
    if (
      req.params.signature === paymentDetails.signature &&
      req.params.paymentid === paymentDetails.paymentId
    ) {
      let userCart = await cartModel.findOne({ user: req.params.userid });
      if (address && address.trim().length > 0) {
        await orderModel.create({
          orderId: req.params.orderid,
          user: req.params.userid,
          products: userCart.products,
          totalprice: userCart.totalprice,
          status: "pending",
          payment: paymentDetails._id,
          address: user.address,
        });
      } else {
        await orderModel.create({
          orderId: req.params.orderid,
          user: req.params.userid,
          products: userCart.products,
          totalprice: userCart.totalprice,
          status: "pending",
          payment: paymentDetails._id,
        });
      }

      let order = await orderModel.findOne({ orderId: req.params.orderid });

      await cartModel.deleteMany({ userId: order.userId });
      // res.redirect(`/map/${req.params.orderid}`);
      res.render("complete", {
        orderid: req.params.orderid,
        address: user.address,
      });
    } else {
      res.send("Invalid payment");
    }
  }
);

router.post("/address/:orderid", async function (req, res) {
  let order = await orderModel.findOne({ orderId: req.params.orderid });
  let userid = order.user;
  let user = await userModel.findOne({ _id: userid });
  if (!order) return res.send("Sorry, this order does not exists");
  if (!req.body.address) return res.send("You must provide a valid address");
  order.address = req.body.address;
  user.address = req.body.address;
  await order.save();
  await user.save();
  res.redirect("/");
});

router.get("/", async function (req, res) {
  try {
    // Populate products in each order to get full product details
    let orders = await orderModel.find({ user: req.session.passport.user }).populate('products');

    res.render('myOrders', { orders }); // Directly pass populated orders to template
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
