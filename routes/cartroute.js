const { Router } = require('express');

const router = require('express').Router()

const cartController = require('../controllers/cartcontrole')

/* GET cart page. */
router.get('/', cartController.getCart)

router.post('/', cartController.cartPost)

router.post('/delete', cartController.postDelete)

router.post('/update', cartController.updateCart)


module.exports = router
