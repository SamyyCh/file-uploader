// app.js

require('dotenv').config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passports = require("passport");
const fileRouter = require("./routes/fileRouter");
const path = require("path");
const app = express();
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      })}));

app.use(flash());

app.use(passports.initialize());
app.use(passports.session());

app.use("/", fileRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
