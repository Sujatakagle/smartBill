const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Food', 'Shopping', 'Medical', 'Fuel', 'Bills', 'Other'],
    required: true
  },

  // ADD THIS
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet', 'Other'],
    default: 'Other'
  },

  date: {
    type: Date,
    default: Date.now
  },
  imageUrl: String,
  entryType: {
    type: String,
    enum: ['ai_extracted', 'manual'],
    default: 'ai_extracted'
  }
});

module.exports = mongoose.model('Expense', expenseSchema);