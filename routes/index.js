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


  router.get('/profile/:userid', async function (req, res) {
    try {
      let user = await userModel.findOne({ _id: req.params.userid });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.render('userProfile', { user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  // Edit Profile Route
router.get('/profile/edit/:userid', async function (req, res) {
    try {
        let user = await userModel.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('editProfile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
  });
  
  
  // Update profile logic (optional, after form submission)
  router.post('/profile/edit/:userid', async function (req, res) {
    try {
        const { name, email, phone, address } = req.body;
        let user = await userModel.findByIdAndUpdate(
            req.params.userid,
            { name, email, phone, address },
            { new: true } // Return updated user
        );
        res.redirect(`/profile/${user._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
  });



module.exports = router;