const { transporter } = require("../config/Mailer");
const { Response } = require("../config/Response");
const Customer = require("../Models/CustomerModel");
const TransactionModel = require("../Models/TransactionModel");


exports.allAccountList = async (req, res) => {
    try {
        const allAccounts = await Customer.find();
        const totalAccounts = await Customer.countDocuments();
        Response(res, 200, "OK", "All accounts found.", "All accounts found.", {
            accounts: allAccounts,
            totalAccounts: totalAccounts
        });
      } catch (error) {
        console.error("Error getting all accounts:", error);
        Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
      }
}


exports.getTransactionsByAccountNo = async (req, res) => {
    const { accountNo } = req.query;  // Extract account number from query string
  
    if (!accountNo) {
      return res.status(400).json({ status: 400, message: 'Account number is required.' });
    }
  
    try {
      // Find transactions where the account number matches either sender or receiver
      const transactions = await TransactionModel.find({
        $or: [
          { senderAccountNo: accountNo },
          { receiverAccountNo: accountNo }
        ]
      });
  
      // If no transactions are found
      if (transactions.length === 0) {
        return res.status(404).json({ status: 404, message: 'No transactions found for this account.' });
      }
  
      return res.status(200).json({
        status: 200,
        message: 'Transactions retrieved successfully.',
        data: transactions,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error. Please try again later.' });
    }
  };

exports.active = async (req, res) => {
    try {
        const accountNo = req.params.accountNo;
        const account = await Customer.findOne({ accountNo: accountNo });
        if (!account) {
            Response(res, 404, "Not Found", "Account not found.", "Account not found.", null);
            return;
        }
        account.status = "active";
        await account.save();
        Response(res, 200, "OK", "Account activated.", "Account activated.", null);
    }
    catch (error) {
        console.error("Error activating account:", error);
        Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
    }
}

exports.deactivate = async (req, res) => {
    try {
        const accountNo = req.params.accountNo;
        const account = await Customer.findOne({ accountNo: accountNo });
        if (!account) {
            Response(res, 404, "Not Found", "Account not found.", "Account not found.", null);
            return;
        }
        account.status = "inactive";
        await account.save();
        Response(res, 200, "OK", "Account deactivated.", "Account deactivated.", null);
    }
    catch (error) {
        console.error("Error deactivating account:", error);
        Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
    }
}

exports.depositMoney = async (req, res) => {
    const { accountNo, amount } = req.body;
  
    if (!accountNo || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ status: 400, message: 'Invalid account number or amount.' });
    }
  
    try {
      // Find the account by account number
      const account = await Customer.findOne({ accountNo });
  
      if (!account) {
        return res.status(404).json({ status: 404, message: 'Account not found.' });
      }
  
      // Deposit money by adding the amount to the current balance
      account.balance += parseFloat(amount);
  
      // Save the updated account balance
      await account.save();
  
      // Log the transaction in the Transaction collection
      const transaction = new TransactionModel({
        senderAccountNo: 'SYSTEM', // As this is a deposit, there is no sender
        receiverAccountNo: accountNo,
        amount: parseFloat(amount),
        transactionType: 'credit', // Since money is credited to the account
        transactionDate: new Date(),
      });
  
      await transaction.save(); // Save the transaction


    //   const mailOptions = {
    //     from: process.env.EMAIL_USER, // Sender address
    //     to: account.email, // Recipient address
    //     subject: "Your Password Has Been Successfully Changed", // Subject line
    //     text: `Dear Customer,
    //           Your password has been successfully changed. If you did not request this change, please contact our support team immediately.
    //           Best regards, Eastern Bank PLC (EBL)`, // Plain text body
    //     html: `<p>Dear Customer,</p>
    //            <p>Your password has been successfully changed. If you did not request this change, please contact our support team immediately.</p>
    //            <p>Best regards,</p>
    //            <p><strong>Eastern Bank PLC (EBL)</strong></p>`, // HTML body
    //   };

    //   const info = await transporter.sendMail(mailOptions);
    //   console.log('Email sent:', info.messageId);

        // Send the email
  
      return res.status(200).json({
        status: 200,
        message: `Money deposited successfully. New balance is BDT ${account.balance}`,
        transactionId: transaction.transactionId, // Return the transaction ID
      });
    } catch (error) {
      console.error('Error during deposit:', error);
      return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  };