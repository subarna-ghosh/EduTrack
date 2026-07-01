const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
const sendEmail = require("../../utils/sendMail");
const sendForgotPasswordEmail = require("../../utils/sendForgotMail");
const {
  createAccessToken,
  createRefreshToken,
} = require("../../utils/createToken");
class AuthController {
  viewlogin(req, res) {
    return res.render("admin/login");
  }

  async saveLogin(req, res) {
    try {
      const { email, password } = req.body;
      const isPresent = await User.findOne({ email });

      if (!isPresent) {
        console.log("User not found");
        req.flash("error", "User not found");
        return res.redirect("/web/view/login");
      }
      const isMatch = await bcrypt.compare(password, isPresent.password);
      if (!isMatch) {
        req.flash("error", "Invalid password");
        return res.redirect("/web/view/login");
      }

      const role = await Role.findById(isPresent.roleId);
      if (!role) {
        req.flash("error", "Role not found");
        return res.redirect("/web/view/login");
      }

      // ACCESS TOKEN
      const accessToken = createAccessToken({
        id: isPresent._id,
        name: isPresent.name,
        email: isPresent.email,
        role: role.roleName,
      });

      // REFRESH TOKEN
      const refreshToken = createRefreshToken({
        id: isPresent._id,
        name: isPresent.name,
        email: isPresent.email,
        role: role.roleName,
      });

      isPresent.refreshToken = refreshToken;
      await isPresent.save();

      // Cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Role Based Redirect
      if (role.roleName.toLowerCase() === "admin") {
        req.flash("success", "welcome, Admin!");
        return res.redirect("/web/view/admin/dashboard");
      }

      if (role.roleName.toLowerCase() === "faculty") {
        req.flash("success", "welcome, Faculty!");
        return res.redirect("/web/view/faculty/dashboard");
      }

      if (role.roleName.toLowerCase() === "student") {
        req.flash("success", "welcome, Student!");
        return res.redirect("/web/view/student/dashboard");
      }

      return res.redirect("/web/view/login");
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/web/view/login");
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.redirect("/web/view/login");
      }
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
      );
      const findUser = await User.findOne({
        _id: decoded.id,
        refreshToken,
      });
      if (!findUser) {
        console.log("user not found!");
        return res.redirect("/web/view/login");
      }
      const role = await Role.findById(findUser.roleId);
      if (!role) {
        return res.redirect("/web/view/login");
      }
      const newAccessToken = createAccessToken({
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: role.roleName,
      });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      const redirectUrl =
        req.cookies.redirectAfterRefresh || "/web/view/admin/dashboard";

      res.clearCookie("redirectAfterRefresh");
      return res.redirect(redirectUrl);
    } catch (error) {
      return res.redirect("/web/view/login");
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await User.findOneAndUpdate(
          { refreshToken },
          { $unset: { refreshToken: 1 } },
        );
      }
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      req.flash("success", "Logged out successfully!");

      return res.redirect("/web/view/login");
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("/web/view/login");
    }
  }

  viewforgotPassword(req, res) {
    return res.render("admin/forgot_password");
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Check User
      const findUser = await User.findOne({ email });

      if (!findUser) {
        req.flash("error", "Email not found");
        return res.redirect("/web/view/forgot-password");
      }

      // Generate Temporary Password
      const temporaryPassword =
        "LMS@" + Math.floor(100000 + Math.random() * 900000);

      // Hash Password
      const hashPassword = await bcrypt.hash(temporaryPassword, 10);

      // Update Password
      findUser.password = hashPassword;
      await findUser.save();

      // Send Email
      await sendForgotPasswordEmail(req, findUser, temporaryPassword);

      req.flash(
        "success",
        "A temporary password has been sent to your registered email.",
      );

      return res.redirect("/web/view/login");
    } catch (error) {
      console.log(error);

      req.flash("error", "Something went wrong");
      return res.redirect("/web/view/forgot-password");
    }
  }
}
module.exports = new AuthController();
