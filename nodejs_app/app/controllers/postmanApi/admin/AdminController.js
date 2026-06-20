// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../../models/Role");
const User = require("../../../models/User");
const httpStatusCode = require("../../../utils/httpStatusCode");


class AdminController {

  viewAdminDashboard(req, res) {
    try {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "welcome to admin dashboard",
        data: req.admin
      })
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }
  }

}



module.exports = new AdminController();
