const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");
const bcrypt = require("bcrypt");

// handle error
const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", email: "", password: "" };

  //incorrect email or password
  if (err.message === "incorrect email") {
    errors.email = "this email is not registered";
  }
  if (err == "incorrect password") {
    errors.password = "the password is incorrect";
  }
  // duplicate error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
  }
  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_WEB_TOKEN, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 3 * 24 * 60 * 60,
    });
    res.status(201).redirect("login");
  } catch (err) {
    const errors = handleError(err);
    console.log("error message");
    res.status(400).render("register", {
      errors,
      name,
      email,
      password,
    });
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  // try {
  //   const user = await User.login(email, password);
  //   const token = createToken(user._id);
  //   res.cookie("jwt", token, {
  //     httpOnly: true,
  //     maxAge: 1000 * 3 * 24 * 60 * 60,
  //   });
  //   res.redirect("/");
  // } catch (err) {
  //   const errors = handleError(err);
  //   console.log(err);
  //   res.render("login", {
  //     errors,
  //     email,
  //     password,
  //   });
  // }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = await createToken(user._id);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 3 * 24 * 60 * 60,
        });
        res.redirect("/");
      } else {
        errors = { password: "the password is incorrect" };
        res.render("login", { errors });
      }
    } else {
      errors = { email: "this email is not registered" };
      res.render("login", { errors });
    }
  } catch (err) {
    next(err);
  }
};

exports.getLogout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("login");
};
