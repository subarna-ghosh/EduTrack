const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.cookie("redirectAfterRefresh", req.originalUrl, {
        httpOnly: true,
      });
      return res.redirect("/web/refresh-token");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.cookie("redirectAfterRefresh", req.originalUrl, {
        httpOnly: true,
      });
      return res.redirect("/web/refresh-token");
    }
    return res.redirect("/web/view/login");
  }
};

module.exports = protect;
