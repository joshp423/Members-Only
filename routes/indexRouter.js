const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.authenticateGet);
indexRouter.get("/sign-up", indexController.signUpFormGet);
indexRouter.post("/sign-up", indexController.signUpFormPost);
indexRouter.post("/log-in", indexController.logInPost);
indexRouter.get("/log-out", indexController.logOutGet);
indexRouter.get("/messageboard", indexController.allMessagesGet);
indexRouter.get("/messageboard/new-message", indexController.writeMessageGet);

module.exports = indexRouter;
