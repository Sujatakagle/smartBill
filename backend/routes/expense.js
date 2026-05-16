const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('bill'), expenseController.uploadBill);
router.post('/', auth, expenseController.addExpense);
router.get('/', auth, expenseController.getExpenses);
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;
