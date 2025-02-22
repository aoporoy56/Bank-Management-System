const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // To generate unique transaction IDs

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(), // Generate unique transaction ID if not provided
  },
  senderAccountNo: {
    type: String,
    required: true,
    trim: true,
  },
  receiverAccountNo: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01, // Ensure the transaction amount is greater than 0
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['credit', 'debit'], // Allow only predefined transaction types
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now, // Set the current date as the default
  },
}, {
  timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports = TransactionModel;
