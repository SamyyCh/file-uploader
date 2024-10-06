const { Router } = require("express");
const fileController = require("../controllers/fileController");
const ensureAuthenticated = require("../middlewares/auth");
const fileRouter = Router();

fileRouter.get("/", fileController.renderIndex);

module.exports = fileRouter;
