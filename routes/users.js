const express = require('express');
const router = express.Router();

const { getSignup, postSignup } = require('../controllers/signupController');

router.get('/signup', getSignup);
router.post('/signup', postSignup);

module.exports = router;
