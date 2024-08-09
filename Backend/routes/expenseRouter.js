const express = require('express')
const expenseContainer = require('../controller/expenseController')
const router = express.Router()

router.post('/createExpense', expenseContainer.createExpense)
router.get('/getExpenses', expenseContainer.getExpenses)
router.delete('/:id', expenseContainer.deleteExpense)

module.exports = router
