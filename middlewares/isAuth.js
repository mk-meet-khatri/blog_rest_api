const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization
      ? req.headers.authorization.split(" ")
      : [];

    const token = authorization.length > 1 ? authorization[1] : null;

    if (!token) {
      res.status(400);
      throw new Error("Token is required!");
    }

    try {
      const payload = jwt.verify(token, jwtSecret);
      // console.log(payload);

      if (payload) {
        req.user = {
          _id: payload._id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };
        return next();
      } else {
        res.status(401);
        throw new Error("Unauthorized!");
      }
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        res.status(401);
        throw new Error("Invalid token!");
      } else if (err.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Token has expired!");
      } else {
        throw err;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
