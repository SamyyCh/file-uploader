//fileController.js

const pool = require("../db/pool");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

async function renderIndex(req, res, next) {
  res.render("index")
}

module.exports = {
    renderIndex
};