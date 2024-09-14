const express = require('express')
const {forgotPassword, resetPassword, updatePassword} = require('../controller/passwordController')
const router = express.Router()

//* After form submission
router.post('/update-password/:uuid', updatePassword)
router.post('/forgot-password', forgotPassword)
router.use('/reset-password/:uuid', resetPassword)


module.exports = router