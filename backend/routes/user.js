const express = require('express');
const router = express.Router();

//Contre la force brute de spam de requete
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { signup, login } = require('../controllers/user');

//importation des controles
const password = require('../middleware/password');
const checkEmail = require('../middleware/ctrlEmail');

//Inscription
router.post('/signup', checkEmail, password, signup);

//Connection
router.post('/login', limiter, login);

module.exports = router;
