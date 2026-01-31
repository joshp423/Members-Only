require("dotenv").config();
const db = require("../db/queries");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

async function allMessagesGet(req, res) {
  
  return res.redirect("/");
}

async function authenticateGet(req, res) {
  const messages = await db.getAllMessages();
  messages.forEach(m => {
    m.timeadded = new Date(m.timeadded).toLocaleString();
  });
  console.log(req.user)
  res.render("index", { title: "Members Only Messageboard", messages, user: req.user });
}

async function signUpFormGet(req, res) {
  res.render("sign-up-form", { title: "Sign Up", user: req.user });
}

const { body, validationResult, matchedData } = require("express-validator");
const alphaErr = "must only contain letters";
const emailErr = "must be a valid email address";
const emailLengthErr = "must be between 1 and 50 characters";
const lengthErrShort = "must be between 1 and 25 characters";
const passwordAlphaNumericErr = "must contain at least a letter and a number";

const validateSignUp = [
  body("firstName")
    .trim()
    .escape()
    .isAlpha()
    .withMessage(`First Name: ${alphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`First Name: ${lengthErrShort}`),
  body("lastName")
    .trim()
    .escape()
    .isAlpha()
    .withMessage(`Last Name: ${alphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`Last Name: ${lengthErrShort}`),
  body("username")
    .trim()
    .isEmail()
    .withMessage(`Email: ${emailErr}`)
    .isLength({ min: 1, max: 50 })
    .withMessage(`Email: ${emailLengthErr}`),
  body("password")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Password: ${lengthErrShort}`)
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/) //regular expression for contains a letter and a number
    .withMessage(`Password: ${passwordAlphaNumericErr}`),
];

const signUpFormPost = [
  ...validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        title: "Sign Up",
        user: req.user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, username, password } = matchedData(req);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.addNewUser(firstName, lastName, username, hashedPassword);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

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
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.userLookupId(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

const logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

async function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function writeMessageGet (req, res) {
  console.log(req.user.id);
  res.render("messages/writeMessageForm", {user: req.user});
}

const lengthErrMessage = "must be more than 1 character and less than 250";

const validateMessageText = [
  body("title")
  .trim()
  .escape()
  .isLength({min: 1, max: 25}).withMessage(`Message Title: ${lengthErrShort}`),
  body("text")
  .trim()
  .escape()
  .isLength({min: 1, max: 250}).withMessage(`Message Text: ${lengthErrMessage}`)
]

const submitMessagePost = [
  ...validateMessageText,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("messages/writeMessageForm", {
        title: "New Message",
        user: req.user,
        errors: errors.array(),
      });
    }
    const {title, text} = matchedData(req);
    await db.submitNewMessage(title, text, req.user.id)
    res.redirect('/messageboard')
  }
] 


module.exports = {
  allMessagesGet,
  authenticateGet,
  signUpFormGet,
  signUpFormPost,
  logInPost,
  logOutGet,
  writeMessageGet,
  submitMessagePost
};
