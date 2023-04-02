const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');//associer les fonctions au différentes routes.
const email = require('../middleware/email');
const password = require('../middleware/password');
router.post('/signup', email, password, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;
