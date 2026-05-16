const Expense = require('../models/Expense');
const { extractBillData } = require('../utils/gemini');

exports.uploadBill = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const data = await extractBillData(req.file.buffer, req.file.mimetype);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || 'AI extraction failed' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const newExpense = new Expense({
      ...req.body,
      userId: req.user.id
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    if (expense.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
