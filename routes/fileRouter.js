const { Router } = require("express");
const fileController = require("../controllers/fileController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fileRouter = Router();

fileRouter.get("/", fileController.renderIndex);
fileRouter.get("/upload", fileController.getForm);
fileRouter.post("/upload", upload.single('file'), fileController.uploadFile);
fileRouter.get("/view", fileController.getFiles);
fileRouter.get("/view/:id", fileController.getFileDetails);
fileRouter.get("/createFolder", fileController.getFolderForm);
fileRouter.post("/createFolder", fileController.postFolder);
fileRouter.get("/folders", fileController.getFolders);
fileRouter.get("/folders/:id", fileController.getFolder);
fileRouter.delete("/view/:id", fileController.deleteFile);
fileRouter.delete("/folders/:id", fileController.deleteFolder);
fileRouter.put("/folders/:id", fileController.updateFolder);


module.exports = fileRouter;
