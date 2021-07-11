const { Router } = require("express");
const router = Router();
const validation = require("../config/validation");

const { home } = require("../controllers/home.controller");
const { login, signup, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/jwt");

router.get("/", verifyToken, home);
router.post("/login", login);
router.post("/signup", validation, signup);
router.post("/logout", logout);
router.get("/token", verifyToken, async (req, res, next) => {
  try {
    return res.status(200).send(true);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
