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





module.exports = router;
