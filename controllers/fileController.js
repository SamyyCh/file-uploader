//fileController.js

const pool = require("../db/pool");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

async function renderIndex(req, res) {
  res.render("index")
}

async function getForm(req, res) {
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

async function getFiles(req, res) {
  res.render("view")
}

async function getFolderForm(req, res) {
  res.render("folderForm")
}

async function getFolders(req, res) {
  res.render("folders")
}

module.exports = {
  renderIndex,
  getForm,
  uploadFile,
  getFiles,
  getFolderForm,
  getFolders
};