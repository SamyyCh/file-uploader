//fileController.js

const pool = require("../db/pool");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

async function renderIndex(req, res, next) {
  res.render("index")
}

async function getForm(req, res, next) {
  res.render("form")
}

async function uploadFile(req, res, next) {
  try {
    const { filename, path } = req.file;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  renderIndex,
  getForm,
  uploadFile
};