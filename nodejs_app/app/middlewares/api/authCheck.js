const jwt = require("jsonwebtoken");
const httpStatusCode = require("../../utils/httpStatusCode");


const authChek = (req, res, next) => {

  try {

    let token = req.headers.authorization;

    // console.log("Authorization Header:", token);

    if (!token) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Token is required",
      });
    }

    // Remove Bearer
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }

    // console.log(token);

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );

    // console.log(decoded);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      status: false,
      message: "invalid token",
    });

  }
};

module.exports = authChek;