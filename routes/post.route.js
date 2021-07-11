const { Router } = require('express');
const router = Router();

const post = require('../controllers/post.controller');
const {verifyToken} = require('../middlewares/jwt');

router.post('/post', verifyToken, post.create);
router.get('/post', verifyToken, post.getPosts);
router.delete('/post', verifyToken, post.deletePost);
router.patch('/post', verifyToken, post.updatePost);

module.exports = router;