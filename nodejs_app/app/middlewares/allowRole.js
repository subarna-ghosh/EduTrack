const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash("error", "Unauthorized Access");
      return res.redirect("/web/view/login");
    }

    next();
  };
};

module.exports = roleCheck;
