const { Router } = require('express');
const router = require('express').Router()
const wishListController = require('../controllers/wishlistcontrole')

router.get('/', wishListController.getWishList)

module.exports = router
