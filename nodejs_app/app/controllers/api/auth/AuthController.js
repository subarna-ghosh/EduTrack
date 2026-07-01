const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Role = require("../../../models/Role");
const User = require("../../../models/User");

const httpStatusCode = require("../../../utils/httpStatusCode");

const { createAccessToken, createRefreshToken } = require("../../../utils/createToken");


class AuthController {

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required"
        })
      }

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not exist"
        })
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const role = await Role.findById(existingUser.roleId);

      if (!role) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Role not found"
        });
      }

      // access token

      const accessToken = createAccessToken({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: role.roleName,
      });

      // refresh token

      const refreshToken = createRefreshToken({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: role.roleName,
      });

      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User logged in successfully",
        data: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }

  }

  async refreshToken(req, res) {
    try {

      const { refreshToken } = req.body;         

      if (!refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({ 
          success: false,
          message: "No refresh token" 
        });
      }

      const existingUser = await User.findOne({ refreshToken });

      if (!existingUser) {
        return res.status(httpStatusCode.FORBIDDEN).json({ 
          success: false,
          message: "Invalid refresh token" 
        });
      }

      const role = await Role.findById(existingUser.roleId);

      if (!role) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Role not found"
        });
      }

      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET_KEY
        );

        const accessToken = createAccessToken({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: role.roleName,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User logged in successfully",
        data: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role
        },
        accessToken
      });

      } catch (err) {
        return res.status(httpStatusCode.FORBIDDEN).json({ 
          success: false,
          message: "Expired refresh token"
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }

  }

 async logout(req, res) {
  try {
    return res.status(httpStatusCode.OK).json({
      status: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

}


module.exports = new AuthController();