const express = require('express')
const {forgotPassword, resetPassword} = require('../controller/passwordController')
const router = express.Router()

router.post('/forgot-password', forgotPassword)
router.put('/reset-password:token', resetPassword)

module.exports = router