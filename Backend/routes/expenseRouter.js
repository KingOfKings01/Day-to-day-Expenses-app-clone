const express = require('express')
const expenseContainer = require('../controller/expenseController')
const router = express.Router()

router.post('/:id', expenseContainer.createExpense)
router.get('/:id', expenseContainer.getExpenses)
router.delete('/:id', expenseContainer.deleteExpense)

module.exports = router
