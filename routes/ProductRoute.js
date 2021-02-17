const { Router } = require('express');
var express = require('express');
var router = express.Router();
const productController = require('../controllers/ProductController')

/* GET product detail page. */
router.get('/product-detail/:id', productController.getProduct)

router.get('/productlist/:category', productController.getProductCategory )

module.exports = router;
