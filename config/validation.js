const { body } = require("express-validator");

module.exports = [
  body("data.email").isEmail(),
  body("data.password").isLength({ min: 5, max: 15 }),
  body("data.confirm_password").custom((confirm_password, { req }) => {
    if (confirm_password !== req.body.data.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];
