require("dotenv").config();
const express = require("express"); // Ensure express is required
const { func } = require("joi");
const { paymentModel } = require("../models/payment");
const router = express.Router(); // Create a router instance

router.get("/:orderid/:paymentid/:signature", async function (req, res) {
  let paymentDetails = await paymentModel.findOne({
    orderId: req.params.orderid,
  });

  if (!paymentDetails) return res.send("Sorry, Payment is Unsuccessful");
  
  // Check for both signature and payment ID
  if (req.params.signature === paymentDetails.signature && req.params.paymentid === paymentDetails.paymentId) {
    res.render("complete");
  } else {
    res.send("Invalid payment");
  }
});


module.exports = router;
