const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

const { body } = require("express-validator");

//
exports.login = async (req, res, next) => {
  try {
    if (!req.body.email) {
      req.flash("info", "Email can not be empty!");
      res.redirect("/login-view");
    }

    if (!req.body.password) {
      req.flash("info", "Password can not be empty!");
      res.redirect("/login-view");
    }

    const [user] = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!Boolean(user)) {
      req.flash("info", "User not found!");
      res.redirect("/login-view");
    }
    const passwordDataIsValid = await bcrypt.compare(
      req.body?.password,
      user?.password
    );

    if (!passwordDataIsValid) {
      req.flash("info", "Password is not correct!");
      res.redirect("/login-view");
    }
    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    if (!req.body.user_name) {
      req.flash("info", "Username can not be empty!");
      res.redirect("/signup-view");
    }

    if (!req.body.email) {
      req.flash("info", "Email can not be empty!");
      res.redirect("/signup-view");
    }

    if (!req.body.password) {
      req.flash("info", "Password can not be empty!");
      res.redirect("/signup-view");
    }

    next();
  } catch (err) {
    next(err);
  }
};

exports.checkPassword = async (req, res, next) => {
  console.log("Check password");
  try {
    if (!req.body.data?.old_password) {
      return res.status(301).send("Password can not be empty!");
    }

    const user = await User.findByPk(req.user_id, {
      raw: true,
      attributes: ["user_id", "user_name", "email", "img_url", "password"],
    });

    if (!Boolean(user)) {
      return res.status(401).send("User not found!");
    }

    const passwordDataIsValid = await bcrypt.compare(
      req.body.data?.old_password,
      user?.password
    );

    if (!passwordDataIsValid) {
      return res.status(301).send("Current password is not correct!");
    }
    console.log(req.body.data?.old_password, "OLD PASSWORD");

    next();
  } catch (err) {
    next(err);
  }
};

exports.verifyCurrentUser = async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      res.render("notLoggedIn");
    }
    next();
  } catch (err) {
    next(err);
  }
};

// // //ovo mora da se doradi
// // exports.verifyUser = async (req, res, next) => {
// //   try{
// //   const user = await User.findById(parseInt(req.body.user_id));
// //   if (!Boolean(user)) {
// //     req.flash('info', 'User not found!');
// //   }
// //   next()
// // }
// // catch(err){
// //   next(err);
// // }
// // }
