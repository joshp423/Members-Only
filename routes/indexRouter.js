const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.authenticateGet);
indexRouter.get("/sign-up", indexController.signUpFormGet);
indexRouter.post("/sign-up", indexController.signUpFormPost);
indexRouter.post("/log-in", indexController.logInPost);
indexRouter.get("/log-out", indexController.logOutGet);
indexRouter.get("/new-message", indexController.writeMessageGet);
indexRouter.post("/new-message", indexController.submitMessagePost)

module.exports = indexRouter;
