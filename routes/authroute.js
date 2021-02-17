var express = require('express');
var router = express.Router();
const authController = require('../controllers/authcontroller')
const validator = require('validator')

router.get('/register', authController.getRegister)
router.get('/login', authController.getLogin)
router.get('/logout', authController.getLogout)

router.post('/register', authController.postRegister)
router.post('/login', authController.postLogin)



module.exports = router