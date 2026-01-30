const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const assetsPath = path.join(__dirname, "public");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;


app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);

require("dotenv").config();

const { Pool } = require("pg");
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});
async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}
getPgVersion();

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));



const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
    throw error;
    }
    console.log(`Members Only - listening on port ${PORT}!`);
});
