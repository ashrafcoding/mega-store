var express = require('express');
var router = express.Router();
const authController = require('../controllers/authcontroller')
const validator = require('validator')

// router of get the register page and calling the getRegister function
router.get('/register', authController.getRegister)

// router of get the login page and calling the getLogin function
router.get('/login', authController.getLogin)

// router for get logout route and its function getLogout
router.get('/logout', authController.getLogout)

// router for post register and send data of registeration to the server
router.post('/register', authController.postRegister)

// router for post login and authenticating the user login with postLogin function
router.post('/login', authController.postLogin)



module.exports = router