const express = require("express");
const router = express.Router();
const controllers = require("./controllers");
const AuthService = require("./AuthService");

router.get("/ping", controllers.ping);
router.get("/debug", controllers.debug);
router.get("/login", controllers.login);
router.post("/login", controllers.loginHandler);
router.get("/logout", AuthService.verifyLogin, controllers.logout);

router.get("/", AuthService.verifyLogin, controllers.ejsIndex);
router.get("/certs", AuthService.verifyLogin, controllers.ejsCerts);
router.get("/sites", AuthService.verifyLogin, controllers.ejsSites);
router.get("/sites/:id", AuthService.verifyLogin, controllers.ejsSiteModify);
router.get("/deploys", AuthService.verifyLogin, controllers.ejsDeploys);
router.get("/actions", AuthService.verifyLogin, controllers.ejsActions);

router.post("/sites", AuthService.verifyLogin, controllers.vpsHandler);
router.post("/certs", AuthService.verifyLogin, controllers.vpsHandler);
router.post("/deploys", AuthService.verifyLogin, controllers.vpsHandler);
router.post("/action/:action", AuthService.verifyLogin, controllers.vpsHandler);

module.exports = router;
