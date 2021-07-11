const { Router } = require("express");
const router = Router();
const { body } = require("express-validator");

const comments = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/jwt");

router.post("/write-comment", verifyToken, comments.create);
router.get("/comments", verifyToken, comments.getComments);

module.exports = router;
