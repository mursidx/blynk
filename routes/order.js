require("dotenv").config();
const express = require("express"); // Ensure express is required
const { func } = require("joi");
const { paymentModel } = require("../models/payment");
const { orderModel } = require("../models/order");
const { cartModel } = require("../models/cart");
const router = express.Router(); // Create a router instance

router.get("/:userid/:orderid/:paymentid/:signature", async function (req, res) {
  let paymentDetails = await paymentModel.findOne({
    orderId: req.params.orderid,
  });

  if (!paymentDetails) return res.send("Sorry, Payment is Unsuccessful");
  
  // Check for both signature and payment ID
  if (req.params.signature === paymentDetails.signature && req.params.paymentid === paymentDetails.paymentId) {
    let userCart = await cartModel.findOne({user: req.params.userid})
    await orderModel.create({
      orderId: req.params.orderid,
      user: req.params.userid,
      products: userCart.products,
      totalprice: userCart.totalprice,
      status: "pending",
      payment: paymentDetails._id,
  })
    // res.redirect(`/map/${req.params.orderid}`);
    res.render('complete', {orderid: req.params.orderid})
  } else {
    res.send("Invalid payment");
  }
});





module.exports = router;
