const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(" ")[1];

   // console.log("no check auth, com token " + token);
   // console.log(jwt.verify(token, "secrete_this_should_be_longer"));

    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodeToken.email, userId: decodeToken.userId };
    next();
  }
  catch (error) {
    res.status(401).json({
      message: "You are not authenticated!"
    })
  }

}
