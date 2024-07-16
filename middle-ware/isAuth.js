const jwt = require("jsonwebtoken");

class AuthJwt {
  async authJwt(req, res, next) {
    try {
      const authHeader = req.headers["x-access-token"];
      // console.log(authHeader);
      if (!authHeader) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
      } else {
        jwt.verify(authHeader, process.env.SECRET_KEY, (err, data) => {
          //  console.log("token verify",data,err);
          if (err) {
            console.log("verification failed");
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
