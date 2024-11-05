require("dotenv").config();
const express = require("express"); // Ensure express is required
const router = express.Router(); // Create a router instance
const { paymentModel } = require("../models/payment");
const { cartModel } = require("../models/cart");
const { userModel } = require("../models/user");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create/orderId", async (req, res) => {

  let userid = req.session.passport.user;
  let user = await userModel.findOne({ _id: userid });
  let cart = await cartModel
    .findOne({ user: req.session.passport.user })
    .populate("products");
  let finalprice = cart.totalprice;


  const options = {
    amount: finalprice * 100, // amount in smallest currency unit
    currency: "INR",
  };
  try {
    const order = await razorpay.orders.create(options);
    res.send(order);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
});

router.post("/api/payment/verify", async function (req, res) {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils");

    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );

    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId, status: "pending"});
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid Signature");
    }
  } catch (error) {
    res.send("Error varify sign")
  }
});

module.exports = router;
