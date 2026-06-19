const express = require("express");
const Router = express.Router();
const AuthController = require("../../controllers/auth/AuthController");
const validateWeb = require("../../middlewares/validateWebMiddleware");
const { saveLoginSchema } = require("../../validations/authValidation");
const authCheck = require("../../middlewares/authCheck");
const allowRole = require("../../middlewares/allowRole");

Router.get("/view/login", AuthController.viewlogin);
Router.post(
  "/save/login",
  validateWeb(saveLoginSchema, "/web/view/login"),
  AuthController.saveLogin,
);
Router.get("/view/forgot-password", AuthController.viewforgotPassword);
Router.get("/refresh-token", AuthController.refreshToken);
Router.get("/logout", authCheck, AuthController.logout);

module.exports = Router;
