const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userModel } = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Check if the user already exists
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Corrected typo: 'uesr' to 'user'
          user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save(); // Save the new user
        }

        cb(null, user); // Always call cb after saving or finding the user
      } catch (error) {
        cb(error, false); // Call cb with the error
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  return cb(null, user._id); // Serialize user ID for session
});

// Corrected to use 'await' when fetching the user
passport.deserializeUser(async function (id, cb) {
  try {
    let user = await userModel.findOne({ _id: id }); // Await the user retrieval
    cb(null, user); // Pass the user object to the callback
  } catch (error) {
    cb(error, null); // Handle errors
  }
});

module.exports = passport;
