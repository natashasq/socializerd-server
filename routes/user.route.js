const { Router } = require("express");
const router = Router();

const { user, updateUser, updatePassword } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/jwt");
const { checkPassword } = require("../middlewares/verifyUser");

router.get("/user", verifyToken, user);
router.patch("/user/info", verifyToken, updateUser);
router.patch("/user/password", [verifyToken, checkPassword], updatePassword)

module.exports = router;
