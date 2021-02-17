const { Router } = require('express');

const router = require('express').Router()

const checkoutController = require('../controllers/checkoutcontrole')


router.get('/', checkoutController.getCheckout)

router.post('/', checkoutController.postCheckout)

router.get('/success', checkoutController.getCheckoutSuccess)

router.get('/cancel', checkoutController.getCheckoutCancel)

router.post('/update', checkoutController.postCheckoutUpdate)





module.exports = router
