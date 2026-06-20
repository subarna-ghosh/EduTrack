const express = require("express");
const router = express.Router();

const AuthController = require("../../controllers/postmanApi/authController/AuthController");
const validateApi = require("../../middlewares/validateApiMiddleware");
const { saveLoginSchema } = require("../../validations/authValidation");
const authCheck = require("../../middlewares/postmanApi/authCheck");
const allowRole = require("../../middlewares/postmanApi/roleCheck");



router.post("/user/login",
  validateApi(saveLoginSchema),
  AuthController.userLogin
);

// router.get("/view/forgot-password", AuthController.viewforgotPassword);

router.post("/refreshtoken", AuthController.refreshToken);

// router.post("/user/logout", authCheck, AuthController.logout);


module.exports = router;
