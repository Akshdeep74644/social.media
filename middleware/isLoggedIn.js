const jwt = require('jsonwebtoken')

const isLoggedIn =  (req, res, next) => {
  if (req.cookies.token === ""){
    res.status(400).redirect("error");
  }
  else {
    let data =  jwt.verify(req.cookies.token, process.env.JWT_key);
    req.user = data;
    console.log(data.user.mail)
  }
  next()
};

module.exports = isLoggedIn;
