const express = require('express');
const { paymentModel } = require('../models/payment');
const router = express.Router()


router.get('/', function (req, res) {
    res.redirect('/products')
});


router.get('/map/:orderid',async function(req, res){
    // console.log(req.params.orderid)
    // let orderid = await paymentModel.findOne({orderId: req.params.orderid})
    res.render('map', {orderid: req.params.orderid})
})

module.exports = router;