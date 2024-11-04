const express = require('express');
const { paymentModel } = require('../models/payment');
const router = express.Router()
const {userModel} = require('../models/user')


router.get('/', function (req, res) {
    res.redirect('/products')
});



router.get('/map/:orderid',async function(req, res){
    // console.log(req.params.orderid)
    // let orderid = await paymentModel.findOne({orderId: req.params.orderid})
    res.render('map', {orderid: req.params.orderid})
})

// tset
router.get('/map/address/:userid',async function(req, res){
    let userid = req.params.userid;
    let user = await userModel.findOne({_id: userid})
    console.log(String(user.address))
 
    // console.log(req.params.orderid)
    // let orderid = await paymentModel.findOne({orderId: req.params.orderid})
    res.render('userMap', {userid: req.params.userid})
})




router.post('/address/:userid',async function(req, res){
    let userid = req.params.userid;
    let user = await userModel.findOne({_id: userid})
    if(!user) return res.send("Sorry, user does not exists. Please SignIn/SignUp");
    if(!req.body.address) return res.send("You must provide address");
    user.address = req.body.address;
    await user.save()
    res.redirect('/')
  })

module.exports = router;