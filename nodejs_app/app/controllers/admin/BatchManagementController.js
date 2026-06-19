// Router.get("", AuthController.viewAdminDashboard);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../../models/Role");
const User = require("../../models/User");
class BatchManagementController {
  viewBatch(req, res) {
    return res.render("admin/add_batch");
  }

  viewListBatch(req, res) {
    return res.render("admin/add_batch_list");
  }

}
module.exports = new BatchManagementController();
