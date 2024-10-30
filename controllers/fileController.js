//fileController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;

async function renderIndex(req, res) {
  try {
    if (!req.session.user) {
      const newUser = await prisma.user.create({
        data: {
          username: `user-${Date.now()}`,
          password: '',
        }
      });

      req.session.user = {
        id: newUser.id,
        username: newUser.username,
      };
    }

    res.render("index");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering index");
  }
}


async function getForm(req, res) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.session.user.id }
    });
    
    res.render("form", { folders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folders");
  }
}

async function uploadFile(req, res, next) {
  try {
    let { folderId } = req.body;

    if (folderId === 'default') {
      const defaultFolder = await prisma.folder.create({
        data: {
          name: "Default Folder",
          userId: req.session.user.id
        }
      });
      folderId = defaultFolder.id;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', public_id: req.file.originalname },
      async (error, result) => {
        if (error) {
          return next(error);
        }

        const formattedTime = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        await prisma.file.create({
          data: {
            filename: req.file.originalname,
            path: result.secure_url,
            folderId: parseInt(folderId),
            size: req.file.size,
            time: formattedTime,
            userId: req.session.user.id
          }
        });

        res.redirect('/view');
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    next(err);
  }
}

async function getFiles(req, res) {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.session.user.id }
    });

    res.render("view", { file: files });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching files");
  }
}

async function getFileDetails(req, res, next) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (file && file.userId === req.session.user.id) {
      res.render("viewDetails", { file });
    } else {
      res.status(404).send("File not found or unauthorized access.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getFolderForm(req, res) {
  res.render("folderForm");
}

async function postFolder(req, res) {
  const { name } = req.body;
  try {
    await prisma.folder.create({
      data: {
        name: name,
        userId: req.session.user.id
      }
    });
    res.redirect('/folders');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating folder");
  }
}

async function getFolders(req, res) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.session.user.id }
    });
    
    res.render("folders", { folders: folders || [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folders");
  }
}

async function getFolder(req, res, next) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { files: true }
    });

    if (folder && folder.userId === req.session.user.id) {
      res.render("viewFolder", { folder });
    } else {
      res.status(404).send("Folder not found or unauthorized access.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function deleteFile(req, res, next) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (file && file.userId === req.session.user.id) {
      await prisma.file.delete({ where: { id: file.id } });
      res.redirect('/view');
    } else {
      res.status(404).send("File not found or unauthorized access.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { files: true }
    });

    if (folder && folder.userId === req.session.user.id) {
      if (folder.files.length > 0) {
        await prisma.file.deleteMany({ where: { folderId: folder.id } });
      }
      await prisma.folder.delete({ where: { id: folder.id } });
      res.redirect('/folders');
    } else {
      res.status(404).send("Folder not found or unauthorized access.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function updateFolder(req, res, next) {
  const folderId = parseInt(req.params.id);
  const { name } = req.body;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId }
    });

    if (folder && folder.userId === req.session.user.id) {
      await prisma.folder.update({
        where: { id: folderId },
        data: { name }
      });
      res.redirect('/folders');
    } else {
      res.status(404).send("Folder not found or unauthorized access.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  renderIndex,
  getForm,
  uploadFile,
  getFiles,
  getFileDetails,
  getFolderForm,
  postFolder,
  getFolders,
  getFolder,
  deleteFile,
  deleteFolder,
  updateFolder
};