require('dotenv').config();
const db = require("../db/queries");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

async function allMessagesGet (req, res) {
    const messages = await db.getAllMessages();
    const messageSenders = await db.getMessageSenderNames();
    const messageSenderMap = {};
    messageSenders.forEach((s) => {
      messageSenderMap[s.id] = `${s.firstname} ${s.lastname}`;
    });
    messages.forEach((message) => {
      message.sender = messageSenderMap[message.id]
    })
    if (messages) {
      res.render("index", {title: "Members Only", messages: messages,  user: req.user });
    }
    res.render("index", {title: "Members Only", messages: "No Messages",  user: req.user });
}

async function authenticateGet (req, res) {
  res.render("login-logout", {user: req.user})
}

async function signUpFormGet (req, res) {
  res.render("sign-up-form", {title: "Sign Up", user: req.user});
}

const { body, validationResult, matchedData } = require("express-validator");
const emailErr = "must be a valid email address";
const emailLengthErr = "must be between 1 and 50 characters";
const passwordLengthErr = "must be between 1 and 25 characters";
const passwordAlphaNumericErr = "must contain at least a letter and a number";

const validateSignUp = [
  body("username")
  .trim()
  .escape()
  .isEmail().withMessage(`Email: ${emailErr}`)
  .isLength({min: 1, max: 50}).withMessage(`Email: ${emailLengthErr}`),
  body("password")
  .trim()
  .escape()
  .isLength({min: 1, max: 25}).withMessage(`Password: ${passwordLengthErr}`)
  .matches("/^(?=.*[A-Za-z])(?=.*\d).+$/gex") //regular expression for contains a letter and a number
  .withMessage(`Password: ${passwordAlphaNumericErr}`)
]

const signUpFormPost = [
  ...validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        title: "Sign Up",
        user: req.user,
        errors: errors.array(),
      });
    }
    const {
      username,
      password
    } = matchedData(req);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.addNewUser(username, hashedPassword);
      res.redirect("/authenticate")
    } catch (error) {
    console.error(error);
    next(error);
   }
  }
]

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.userLookupUsername(username);    
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = db.userLookupId(id);

    done(null, user);
  } catch(err) {
    done(err);
  }
});

async function logInPost (req, res) {
  passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/authenticate"
  })
}

async function logOutGet (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = {
    allMessagesGet,
    authenticateGet,
    signUpFormGet,
    signUpFormPost,
    logInPost,
    logOutGet
}