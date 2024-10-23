//fileController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function renderIndex(req, res) {
  res.render("index")
}

async function getForm(req, res) {
  try {
    const folders = await prisma.folder.findMany();
    
    res.render("form", { folders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folders");
  }
}


async function uploadFile(req, res, next) {
  try {
    const { filename, path } = req.file;
    let { folderId } = req.body;

    if (folderId === 'default') {
      const defaultFolder = await prisma.folder.create({
        data: {
          name: "Default Folder"
        }
      })
      folderId = defaultFolder.id;
    }    

    await prisma.file.create({
      data: {
        filename: filename,
        path: path,
        folderId: parseInt(folderId)
      }
    })
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

async function getFiles(req, res) {
  try {
    const files = await prisma.file.findMany();

    res.render("view", { file: files });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching files");
  }
}

async function getFileDetails(req, res) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (file) {
      res.render("viewDetails", { file });
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
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
    
    res.render("folders", { folders: folders || [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folders");
  }
};

async function getFolder(req, res) {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        files: true
      }
    });

    if (folder) {
      res.render("viewFolder", { folder });
    } else {
      res.status(404).send("Folder not found");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function deleteFile(req, res, next) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (file) {
      await prisma.file.delete({
        where: {
          id: file.id
        }
      });
      res.redirect('/view');
    } else {
      res.status(404).send("File not found.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        files: true
      }
    });
    if (folder) {
      if (folder.files.length > 0) {
        await prisma.file.deleteMany({
          where: {
            folderId: folder.id,
          },
        });
      }
      await prisma.folder.delete({
        where: {
          id: folder.id,
        },
      });
      res.redirect('/folders');
    } else {
      res.status(404).send("Folder not found.");
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
      where: {
        id: folderId
      }
    });

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId
      },
      data: {
        name: name
      }
    });

    res.redirect('/folders');
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