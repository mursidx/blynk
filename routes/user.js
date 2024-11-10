const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateAdmin, userIsLoggedIn } = require("../middlewares/admin");
const { userModel, validateUser } = require("../models/user");
const { func } = require("joi");

router.get("/login", function (req, res) {
  res.render("user_login");
});

router.get("/signin", function (req, res) {
  res.render("signIn");
});

router.get('/profile', function(req, res) {
    res.send('This is profile page');
});


router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err)=>{
        if(err) return next(err)
        res.clearCookie("connect.sid")
    res.redirect('/users/login')
    })
  });
});

//profile router
router.get('/profile/:userid', userIsLoggedIn, async function (req, res) {
  try {
      let user = await userModel.findOne({ _id: req.params.userid });
      res.render('userProfile', { user });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});


// Edit Profile Route
router.get('/profile/edit/:userid', userIsLoggedIn, async function (req, res) {
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
router.post('/profile/edit/:userid', userIsLoggedIn, async function (req, res) {
  try {
      const { name, email, phone, address } = req.body;
      let user = await userModel.findByIdAndUpdate(
          req.params.userid,
          { name, email, phone, address },
          { new: true } // Return updated user
      );
      res.redirect(`/users/profile/${user._id}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
