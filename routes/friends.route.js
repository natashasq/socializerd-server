const { Router } = require("express");
const router = Router();

const { friends, requestAction, addFriend, friendStatus, statusUpdate } = require("../controllers/friends.controller");
const { verifyToken } = require("../middlewares/jwt");
//const user = require('../controllers/user.controller'); //ovo je za renderovanje profile page
//const verifyUser = require('../middlewares/verifyUser'); //ovo nekad za kasnije

router.get("/friends", verifyToken, friends);
router.post("/friends", verifyToken, addFriend);
router.patch("/friends", verifyToken, requestAction);
router.get("/friends/status", verifyToken, friendStatus);
router.patch("/friends/status", verifyToken, statusUpdate);

module.exports = router;
