const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get('/', indexController.allMessagesGet)

module.exports = indexRouter;