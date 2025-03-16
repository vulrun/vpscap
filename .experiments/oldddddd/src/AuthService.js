const jwt = require("jsonwebtoken");

module.exports.getToken = (data) => jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "1 day" });
module.exports.verifyToken = (token) => jwt.verify(token, process.env.SECRET_KEY);

module.exports.verifyLogin = (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      if (!req.cookies.CONNID && req.cookies.CONNID !== "NULL") throw Error("Unauthorized Access");
      this.verifyToken(req.cookies.CONNID || "");
    }

    next();
    return;
  } catch (error) {
    console.error(error);
    return res.openPage("/login", error?.name === "JsonWebTokenError" ? "Invalid Credentials" : error?.message || error || "Something Went WRong");
  }
};
