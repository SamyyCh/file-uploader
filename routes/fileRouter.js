const { Router } = require("express");
const fileController = require("../controllers/fileController");
const ensureAuthenticated = require("../middlewares/auth");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fileRouter = Router();

fileRouter.get("/", fileController.renderIndex);
fileRouter.get("/upload", fileController.getForm);
fileRouter.post("/upload", ensureAuthenticated, upload.single('file'), fileController.uploadFile);

module.exports = fileRouter;
