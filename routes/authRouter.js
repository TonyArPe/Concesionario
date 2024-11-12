const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/register', authController.registerForm);

router.post('/register', authController.register);

router.get('/login', authController.loginForm);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports=router;
