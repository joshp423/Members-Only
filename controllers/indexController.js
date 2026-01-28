require('dotenv').config();
const { localsName } = require('ejs');
const db = require("../db/queries");

const links = [
  { href: "/", text: "Home" },
  if (locals.user) {
    { href: "/log-in", text: "Log In" }
  }
  
];

async function allMessagesGet (req, res) {
    const messages = await db.getAllMessages();
    res.render("index", {title: "Members Only", messages: messages, links: links});
}

module.exports = {
    allMessagesGet
}