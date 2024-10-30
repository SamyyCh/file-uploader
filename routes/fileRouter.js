const { Router } = require("express");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const isAuthenticated = require("../middlewares/authMiddleware");
const fileRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.get("/", fileController.renderIndex);
fileRouter.get("/upload", isAuthenticated, fileController.getForm);
fileRouter.post("/upload", isAuthenticated, upload.single("file"), fileController.uploadFile);
fileRouter.get("/view", isAuthenticated, fileController.getFiles);
fileRouter.get("/view/:id", isAuthenticated, fileController.getFileDetails);
fileRouter.get("/createFolder", isAuthenticated, fileController.getFolderForm);
fileRouter.post("/createFolder", isAuthenticated, fileController.postFolder);
fileRouter.get("/folders", isAuthenticated, fileController.getFolders);
fileRouter.get("/folders/:id", isAuthenticated, fileController.getFolder);
fileRouter.delete("/view/:id", isAuthenticated, fileController.deleteFile);
fileRouter.delete("/folders/:id", isAuthenticated, fileController.deleteFolder);
fileRouter.put("/folders/:id", isAuthenticated, fileController.updateFolder);

module.exports = fileRouter;