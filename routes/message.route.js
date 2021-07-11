const { Router } = require("express");
const router = Router();

const {
  messagesCount,
  getMessages,
  isRead,
  messagesCountTotal,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middlewares/jwt");

router.get("/messages/count", verifyToken, messagesCount);
router.get("/messages", verifyToken, getMessages);
router.patch("/messages", verifyToken, isRead);
router.get("/messages/count_total", verifyToken, messagesCountTotal);
// router.post('/messages/:user_id/is_read', message.isRead);

module.exports = router;
