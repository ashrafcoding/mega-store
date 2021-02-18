const { Router } = require('express');
var express = require('express');
var router = express.Router();
const homeController = require('../controllers/HomeController')

/* GET home page. */
router.get('/', homeController.getHome)


router.get('/contact', homeController.getContact)

module.exports = router;
