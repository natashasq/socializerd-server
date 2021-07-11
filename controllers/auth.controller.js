const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const config = require("../config/auth");
const User = require("../models/user.model").User;

exports.loginView = (req, res) => {
  return res.render("login");
};

exports.signupView = (req, res, next) => {
  return res.render("signup");
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.data.email) {
      return res.status(400).send({ message: "Email can not be empty!" });
    }

    if (!req.body.data.password) {
      return res.status(400).send({ message: "Password can not be empty!" });
    }

    const user = await User.findOne({
      where: {
        email: req.body.data.email,
      },
    });

    console.log(user.password);
    if (!Boolean(user)) {
      return res.status(404).send({ message: "User not found!" });
    }
    const passwordDataIsValid = await bcrypt.compare(
      req.body?.data.password,
      user?.password
    );

    if (!passwordDataIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.user_id }, config.secret, {
      expiresIn: 86400,
    });

    res.cookie("token", token, { httpOnly: true, sameSite: 'none' });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {

  if (!req.body.data.user_name) {
    return res.status(400).send({ message: "Username can not be empty!" });
  }

  if (!req.body.data.email) {
    return res.status(400).send({ message: "Email can not be empty!" });
  }

  if (!req.body.data.password) {
    return res.status(400).send({ message: "Password can not be empty!" });
  }

  const errors = validationResult(req);
  console.log(errors.array())
  const getValidationMsg = (param, message) => {
    switch (param) {
      case "email":
        return "This email is not correct.";
      case "password":
        return "Minimum password length is 5 characters.";
      case "confirm_password":
        return `${message}`
      default:
        return ""
    }
  }
  if (!errors.isEmpty()) {
    return res.status(400).send({ message: getValidationMsg(errors.array()[0].param, errors.array()[0].msg)})
  }

  try {
    await User.create({
      user_name: req.body.data.user_name,
      email: req.body.data.email,
      img_url: req.body.data.img_url,
      password: bcrypt.hashSync(req.body.data.password, 12),
    });

    return res.send("Successfully signed-up");
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", false, {
      expiresIn: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    res.status(200).send('Successfully logged out')
  } catch (err) {
    next(err);
  }
};
