const express = require('express')
const userContainer = require('../controller/userController')
const router = express.Router()

router.post('/sing-in', userContainer.createUser)
router.post('/buy-premium', userContainer.buyPremium)
// router.get('/:id', userContainer.getUserById)
router.post('/login', userContainer.loginUser)
// router.delete('/:id', userContainer.deleteUser)
router.post('/protected-route',userContainer.protectedRoute)
router.post('/update-order',userContainer.updateOrder)

module.exports = router
