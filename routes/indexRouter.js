const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();


indexRouter.get('/', indexController.allMessagesGet);
indexRouter.get('/authenticate', indexController.authenticateGet);
indexRouter.get('/sign-up', indexController.signUpFormGet);
indexRouter.post('/sign-up', indexController.signUpFormPost);
indexRouter.post('/log-in', indexController.logInPost);
indexRouter.get('/log-out', indexController.logOutGet);

module.exports = indexRouter;