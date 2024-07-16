const jwt = require("jsonwebtoken");

class AuthJwt {
  async authJwt(req, res, next) {
    try {
      const authHeader = req.headers["x-access-token"];
      // console.log(authHeader);
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Unable to find Token ",
        });
      } else {
        jwt.verify(authHeader, process.env.SECRET_KEY, (err, data) => {
          //  console.log("token verify",data,err);
          if (err) {
            console.log("verification failed");
            return res.status(401).json({
              success: false,
              message: "Token verification failed ",
            });
            next();
          } else {
            req.user = data;
            next();
          }
        });
        next();
      }
    } catch (err) {
      console.log("Error to verify token: ", err);
    }
  }
}

module.exports = new AuthJwt();
