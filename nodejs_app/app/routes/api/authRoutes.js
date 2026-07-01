const express = require("express");
const router = express.Router();

const AuthController = require("../../controllers/api/auth/AuthController");
const validateApi = require("../../middlewares/validateApiMiddleware");
const { saveLoginSchema } = require("../../validations/authValidation");
const authCheck = require("../../middlewares/api/authCheck");
const allowRole = require("../../middlewares/api/roleCheck");



/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User Login
 *     description: Login using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email               
 *               password:
 *                 type: string
 *                 format: password               
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/user/login",
  validateApi(saveLoginSchema),
  AuthController.userLogin
);

// router.get("/view/forgot-password", AuthController.viewforgotPassword);

// router.post("/refreshtoken", AuthController.refreshToken);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout User
 *     description: Logout the authenticated user by providing a valid JWT token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized or Invalid Token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid token
 */
router.post("/user/logout", authCheck, AuthController.logout);


module.exports = router;
