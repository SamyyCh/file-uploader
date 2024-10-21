//fileController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function postFolder(req, res) {
  const { name } = req.body;
  try {
    await prisma.folder.create({
      data: {
        name: name,
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating folder");
  }
}

async function getFolders(req, res) {
  try {
    const folders = await prisma.folder.findMany();
    
    res.render("folders", { folders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folders");
  }
};

async function getFolder(req, res) {
  const folder = req.body.id;
  res.render("viewFolder", { folder })
}

module.exports = {
  renderIndex,
  getForm,
  uploadFile,
  getFiles,
  getFolderForm,
  postFolder,
  getFolders,
  getFolder
};