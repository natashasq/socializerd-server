const { Router } = require('express');
const router = Router();

const profile = require('../controllers/profile.controller');

router.get('/profile/:user_id/overview', profile.profilePage);


module.exports = router;