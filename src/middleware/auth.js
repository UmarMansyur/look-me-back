const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/api.error");

function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return [
    (req, res, next) => {
      try {
        const token = req.headers["authorization"];
        if (!token) {
          return res.status(401).json(new Error("Akses tidak diizinkan!"));
        }
        const bearerToken = token.split(" ")[1];
        const user = jwt.verify(bearerToken, process.env.JWT_SECRET_ACCESS);
        if (roles.length > 0) {
          let valid = '';
          if (typeof user.role === `string`) {
            valid = roles.find((level) => level == user.role);
          } else {
            if(user.role.length > 0) {
              valid = user.role.find((level) => roles.includes(level));
            }
          }
          if (!valid) {
            throw unauthorized("Akses tidak diizinkan!");
          }
        }

        req.user = user;
        next();
      } catch (error) {
        if (error.message == "jwt malformed") {
          const error = new Error("Token tidak valid!");
          error.status = 401;
          next(error);
        }
        if(error.message == "jwt expired") {
          const error = new Error("Token sudah kadaluarsa!, Jika anda tetap mendapatkan pesan ini, silahkan refresh halaman ini!");
          error.status = 401;
          next(error);
        }
        next(error);
      }
    },
  ];
}

module.exports = authorize;