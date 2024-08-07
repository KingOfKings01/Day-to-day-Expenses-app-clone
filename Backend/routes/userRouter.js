const express = require('express')
const userContainer = require('../controller/userController')
const router = express.Router()

router.post('/user', userContainer.createUser)
router.get('/user/:id', userContainer.getUserById)
router.delete('/user/:id', userContainer.deleteUser)

module.exports = router