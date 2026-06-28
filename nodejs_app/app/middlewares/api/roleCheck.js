const httpStatusCode = require("../../utils/httpStatusCode");
const Role = require('../../models/Role')

const role = (...roles) => {
  return async (req, res, next) => {

    try {
      
      console.log(req.user.role);
      
      if (!roles.includes(req.user.role)) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Access denied"
        });
      }

      next();

    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  };
  
};

module.exports = role;