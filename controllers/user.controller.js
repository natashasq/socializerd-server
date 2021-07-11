const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");

exports.user = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.query?.user_id || req.user_id, {
      attributes: ["user_id", "user_name", "email", "password", "img_url"],
    });

    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (!req.body || !req.body.data?.user_name || !req.body.data?.email) {
      return res
        .status(301)
        .send("Please, enter your username and your email address.");
    }

    await User.update(
      { user_name: req.body.data?.user_name, email: req.body.data?.email },
      {
        where: {
          user_id: req.user_id,
        },
      }
    );

    const updatedUser = await User.findByPk(req.user_id, {
      raw: true,
      attributes: ["user_id", "user_name", "email", "img_url", "password"],
    });

    return res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    console.log("`update password`");
    if (!req.body || !req.body.data?.new_password) {
      return res.status(301).send("Enter the new password.");
    }

    const newPassword = bcrypt.hashSync(req.body.data.new_password, 12);

    await User.update(
      { password: newPassword },
      {
        where: {
          user_id: req.user_id,
        },
      }
    );

    const updatedUser = await User.findByPk(req.user_id, {
      raw: true,
      attributes: ["user_id", "user_name", "email", "img_url", "password"],
    });

    return res.status(200).send(updatedUser); //da li ovde treba poruka?
  } catch (err) {
    next(err);
  }
};
