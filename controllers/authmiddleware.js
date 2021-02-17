const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");
const mongoose = require("mongoose");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_WEB_TOKEN, (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
    next();
  }
};

const checkUser = function (req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.SECRET_WEB_TOKEN,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          next();
        }
        try {
          let user = await User.findById(decodedToken.id);
          itemsCount = req.session.itemsCount;
          req.session.user = user;
          res.locals.user = user;
          //res.locals.itemsCount = itemsCount
          next();
        } catch (err) {
          console.log(err.message);
          res.locals.user = null;
          res.locals.itemsCount = null;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    res.locals.itemsCount = null;
    next();
  }
};

const adminGuard = (req, res, next)=> {
  if(req.session.user.admin) next()
  else{
    res.redirect("/users")
  }
}

module.exports = { requireAuth, checkUser, adminGuard };
