const express = require("express");
const router = express.Router();

const AuthController = require("../../controllers/api/auth/AuthController");
const validateApi = require("../../middlewares/validateApiMiddleware");
const { saveLoginSchema } = require("../../validations/authValidation");
const authCheck = require("../../middlewares/api/authCheck");
const allowRole = require("../../middlewares/api/roleCheck");



/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Login
 *     description: Login using email and password to receive access and refresh tokens.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User login credentials
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials, missing fields, or user not found
 *       500:
 *         description: Internal Server Error
 */

router.post("/user/login",
  validateApi(saveLoginSchema),
  AuthController.userLogin
);

// router.get("/view/forgot-password", AuthController.viewforgotPassword);

router.post("/refreshtoken", AuthController.refreshToken);

// router.post("/user/logout", authCheck, AuthController.logout);


module.exports = router;
