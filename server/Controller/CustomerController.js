const { get } = require("../Router/CustomerRoute");
// const jwt = require("jsonwebtoken");
const Customer = require('../Models/CustomerModel');
const transporter = require('../config/Mailer');
const { Response } = require("../config/Response");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Transaction = require('../Models/TransactionModel');


// function lastAccountNo(callback) {
//   connection.query(
//     "SELECT `account_no` FROM `customer` ORDER BY `account_no` DESC LIMIT 1",
//     (err, result, fields) => {
//       if (err) {
//         callback(err, null);
//       }
//       if (result.length > 0) {
//         callback(null, JSON.parse(JSON.stringify(result[0])).account_no);
//       } else {
//         callback(null, 0);
//       }
//     }
//   );
// }
exports.createAccount = async (req, res) => {

  try {
    // Extract data from the request body
    const {
      accountTitleEnglish,
      accountTitleBangla,
      accountType,
      currency,
      selectedDivision,
      selectedDistrict,
      contactAddress,
      sourceOfFund,
      firstName,
      lastName,
      banglaFullTitle,
      fatherName,
      motherName,
      spouseName,
      gender,
      dob,
      occupation,
      monthlyIncome,
      nationalId,
      email,
      phone1,
      phone2,
      presentAddress,
      permanentAddress,
      religion,
      maritalStatus,
      nomineeName,
      relationshipWithAccountHolder,
      nomineeDob,
      nomineePercentage,
      nomineeNationalId,
      nomineeIdType,
      nomineeOtherIdType,
      nomineeOtherIdDescription,
      nomineeAddress,
      isNomineeUnder18,
      selfImageUrl,
      nidImageUrl,
      signatureImageUrl
    } = req.body;

    // Check required fields (Basic Validation)
    const missingFields = [];
    if (!accountTitleEnglish) missingFields.push("accountTitleEnglish");
    if (!accountType) missingFields.push("accountType");
    if (!currency) missingFields.push("currency");
    if (!selectedDivision) missingFields.push("selectedDivision");
    if (!selectedDistrict) missingFields.push("selectedDistrict");
    if (!contactAddress) missingFields.push("contactAddress");
    if (!sourceOfFund || !Array.isArray(sourceOfFund) || sourceOfFund.length === 0) {
      missingFields.push("sourceOfFund");
    }
    if (!selfImageUrl) missingFields.push("selfImageUrl");
    if (!nidImageUrl) missingFields.push("nidImageUrl");
    if (!signatureImageUrl) missingFields.push("signatureImageUrl");

    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!fatherName) missingFields.push("fatherName");
    if (!motherName) missingFields.push("motherName");
    if (!gender) missingFields.push("gender");
    if (!dob) missingFields.push("dob");
    if (!nationalId) missingFields.push("nationalId");
    if (!email) missingFields.push("email");
    if (!phone1) missingFields.push("phone1");
    if (!presentAddress) missingFields.push("presentAddress");
    if (!permanentAddress) missingFields.push("permanentAddress");
    if (!nomineeName) missingFields.push("nomineeName");
    if (!relationshipWithAccountHolder) missingFields.push("relationshipWithAccountHolder");
    if (!nomineeDob) missingFields.push("nomineeDob");
    if (!nomineePercentage) missingFields.push("nomineePercentage");
    if (!nomineeNationalId) missingFields.push("nomineeNationalId");
    if (!nomineeIdType) missingFields.push("nomineeIdType");
    if (!nomineeAddress) missingFields.push("nomineeAddress");

    // If any fields are missing, return a 400 error
    if (missingFields.length > 0) {
      Response(res, 400, "Bad Request", "Missing required fields", "Missing required fields", missingFields);
      return;
    }

    const existingCustomer2 = await Customer.findOne({ nationalId });
    if (existingCustomer2) {
      Response(res, 400, "Bad Request", "National ID already exists", "National ID already exists", null);
      return;
    }
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      Response(res, 400, "Bad Request", "Email already exists", "Email already exists", null);
      return;
    }


    // Generate password using birth year and some random characters
    const generatePassword = (dob) => {
      const birthYear = new Date(dob).getFullYear();  // Extract birth year from dob
      const randomChars = crypto.randomBytes(2).toString('hex');  // Generate 4 random characters
      return `${birthYear}${randomChars}`;  // Combine birth year and random characters
    };

    const newPassword = generatePassword(dob);  // Generate password with birth year

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Create a new customer document
    const newCustomer = new Customer({
      accountTitleEnglish,
      accountTitleBangla,
      accountType,
      currency,
      selectedDivision,
      selectedDistrict,
      contactAddress,
      sourceOfFund,
      selfImageUrl,
      nidImageUrl,
      signatureImageUrl,
      firstName,
      lastName,
      banglaFullTitle,
      fatherName,
      motherName,
      spouseName,
      gender,
      dob,
      occupation,
      monthlyIncome,
      nationalId,
      email,
      phone1,
      phone2,
      presentAddress,
      permanentAddress,
      religion,
      maritalStatus,
      nomineeName,
      relationshipWithAccountHolder,
      nomineeDob,
      nomineePercentage,
      nomineeNationalId,
      nomineeIdType,
      nomineeOtherIdType,
      nomineeOtherIdDescription,
      nomineeAddress,
      isNomineeUnder18,
      password: hashedPassword,
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();
    const a = savedCustomer._id.toString();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,  // sender address
      to: email,  // list of receivers
      subject: "Your Account Opening Request Has Been Submitted!",  // Subject line
      text: `Dear Valued Customer,
    
    Thank you for banking with Eastern Bank PLC. We are pleased to inform you that your account opening request has been successfully submitted. Please wait for our confirmation.
    
    Your Application ID is: ${a}
    
    Thank you for choosing our services. If you have any questions or need further assistance, please don't hesitate to reach out.
    
    Best regards,
    Eastern Bank PLC (EBL)`,  // plain text body

      html: `<p>Dear Valued Customer,</p>
             <p>Thank you for banking with Eastern Bank PLC. We are pleased to inform you that your account opening request has been successfully submitted. Please wait for our confirmation.</p>
             <p><strong>Your Application ID is:</strong> <b>${a}<b></p>
             <p>Thank you for choosing our services. If you have any questions or need further assistance, please don't hesitate to reach out.</p>
             <p>Best regards,</p>
             <p>Eastern Bank PLC (EBL)</p>`,  // HTML body
    });

    console.log("Message sent: %s", info.messageId);




    // Send success response
    Response(res, 201, "Created", "Customer account created successfully!", "Customer account created successfully!", savedCustomer);
  } catch (error) {
    console.error("Error creating customer account:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  }

};

// exports.createAccount = async (req, res) => {
//   const { full_name, address, email, gender, phone, nid, password, image } =
//     req.body;
//   try {
//     id = 0;
//     account_no = 0;
//     await lastAccountNo((err, result) => {
//       account_no = result + 1;
//       console.log(result);
//       if (err) {
//         response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
//       }
//       if (result) {
//         console.log(account_no);
//         customerCreateQuery =
//           "INSERT INTO Customer VALUEs (?,?,?,?,?,?,?,?,?,?,?,?,?)";
//         customerQueryValue = [
//           id,
//           account_no,
//           full_name,
//           address,
//           email,
//           phone,
//           nid,
//           gender,
//           password,
//           0,
//           image,
//           "Pending",
//           new Date(),
//         ];
//         connection.query(
//           customerCreateQuery,
//           customerQueryValue,
//           (err, result, fields) => {
//             if (err) {
//               err.code == "ER_DUP_ENTRY"
//                 ? // ? res.send("Email Already Used")
//                   response(
//                     res,
//                     500,
//                     "Internal Server Error",
//                     "Duplicate Entry",
//                     err.message
//                   )
//                 : response(
//                     res,
//                     500,
//                     "Internal Server Error",
//                     "Internal Server Error",
//                     err.message
//                   );
//             } else {
//               response(
//                 res,
//                 200,
//                 "OK",
//                 "Account Created. Your Account No : " + account_no,
//                 "Account Created. Your Account No : " + account_no,
//                 result
//               );
//             }
//           }
//         );
//       } else {
//         response(
//           res,
//           500,
//           "Internal Server Error",
//           "Internal Server Error",
//           err.message
//         );
//       }
//     });

//   } catch (error) {
//     response(
//       res,
//       500,
//       "Internal Server Error",
//       "Internal Server Error",
//       error.message,
//       null
//     );
//   }
// };

exports.checkStatus = async (req, res) => {
  const { id } = req.params;
  try {
    // Await the result to get the customer object
    const customer = await Customer.findById(id)


    if (customer) {
      Response(res, 200, "OK", "Application found.", "Application found.", customer.status);
      return;
    } else {
      Response(res, 400, "Not Found", "Application not found.", "Application not found.", null);
      return;
    }
  } catch (error) {
    console.error("Error getting application status:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  }
};
exports.allAccounts = async (req, res) => {
  try {
    const allAccounts = await Customer.find().lean();
    Response(res, 200, "OK", "All accounts found.", "All accounts found.", allAccounts);
  } catch (error) {
    console.error("Error getting all accounts:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  }
}


exports.loginAccount = async (req, res) => {
  try {
    const { accountNo, password } = req.body;

    // Find customer by account number
    const account = await Customer.findOne({ accountNo: accountNo });

    // If account is not found
    if (!account) {
      return Response(
        res,
        404, // Unauthorized
        "Unauthorized",
        "No Account Found",
        "No Account Found",
        null
      );
    }

    // If account status is not active
    if (account.status !== "active") {
      return Response(
        res,
        403, // Forbidden
        "Forbidden",
        "Account is not active",
        "Account is not active",
        null
      );
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return Response(
        res,
        401, // Unauthorized
        "Unauthorized",
        "Incorrect password",
        "Incorrect password",
        null
      );
    }


    // Generate JWT token
    const token = jwt.sign(
      { account_no: account.accountNo },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );


    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: account.email, // recipient's email
      subject: "Login Successful Notification", // Subject line
      text: `Dear Valued Customer,
    
      We are pleased to inform you that you have successfully logged into your account with Eastern Bank PLC. If this login was not performed by you, please contact our support team immediately to secure your account.
    
      Thank you for choosing Eastern Bank PLC for your banking needs.
    
      Best regards,
      Eastern Bank PLC (EBL)`, // plain text body

      html: `<p>Dear Valued Customer,</p>
             <p>We are pleased to inform you that you have successfully logged into your account with Eastern Bank PLC.</p>
             <p>If this login was <b>not</b> performed by you, please contact our support team immediately to secure your account.</p>
             <p>Thank you for choosing Eastern Bank PLC for your banking needs.</p>
             <p>Best regards,</p>
             <p>Eastern Bank PLC (EBL)</p>`, // HTML body
    });

    console.log("Message sent: %s", info.messageId);




    // Send response with the token and account details
    return Response(
      res,
      200, // OK
      "OK",
      "Login successful",
      "Login successful",
      { token, account }
    );

  } catch (error) {
    console.error("Error during login:", error);
    return Response(
      res,
      500, // Internal Server Error
      "Internal Server Error",
      "Internal Server Error",
      error.message,
      null
    );
  }
};


exports.findAccount = async (req, res) => {
  const { accountNo } = req.params;
  try {
    const account = await Customer.findOne({ accountNo }
    );
    if (!account) {
      Response(res, 404, "Not Found", "Account not found.", "Account not found.", null);
      return;
    }
    Response(res, 200, "OK", "Account found.", "Account found.", account);
  }
  catch (error) {
    console.error("Error finding account:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  }
};


const otpStore = new Map(); // Format: { transactionId: { otp, accountNo, expiresAt } }

exports.sendOtp = async (req, res) => {
  var { accountNo, password, receiverAccountNo, amount } = req.body;


  if (accountNo === receiverAccountNo) {
    return res.status(400).json({ status: 400, message: 'Sender and receiver account cannot be the same.' });
  }
  amount = parseInt(amount, 10);

  try {
    // Validate sender account
    const sender = await Customer.findOne({ accountNo });
    console.log(accountNo);
    if (!sender) {
      return res.status(404).json({ status: 404, message: 'Sender account not found.' });
    }

    // Validate receiver account
    const receiver = await Customer.findOne({ accountNo: receiverAccountNo });
    if (!receiver) {
      return res.status(404).json({ status: 404, message: 'Receiver account not found.' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, sender.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: 'Incorrect password.' });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);
    const transactionId = crypto.randomUUID(); // Unique transaction ID

    // Save OTP details with a 5-minute expiration
    otpStore.set(transactionId, {
      otp,
      accountNo,
      receiverAccountNo,
      amount,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes in milliseconds
    });




    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sender.email, // Sender's email address
      subject: 'Your OTP for Money Transfer',
      text: `Dear ${sender.accountTitleEnglish},
  
        Your OTP for transferring BDT ${amount} to account ${receiverAccountNo} is ${otp}. 
        The OTP will expire in 5 minutes.
        
        If you did not initiate this transfer, please contact our support team immediately.
        
        Thank you for choosing Eastern Bank PLC for your banking needs.
    
      Best regards,
      Eastern Bank PLC (EBL)`,
      html: `<p>Dear ${sender.accountTitleEnglish},</p>
              <p>Your OTP for transferring <b>BDT ${amount}</b> to account <b>${receiverAccountNo}</b> is <b>${otp}</b>.</p>
              <p><i>The OTP will expire in 5 minutes.</i></p>
              <p>If you did not initiate this transfer, please contact our support team immediately.</p>
              <p>Thank you for choosing Eastern Bank PLC for your banking needs.</p>
             <p>Best regards,</p>
             <p>Eastern Bank PLC (EBL)</p>`,
    });

    console.log('OTP email sent: %s', info.messageId);

    res.status(200).json({
      status: 200,
      message: 'OTP sent successfully.',
      data: { transactionId },
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { transactionId, otp, accountNo, receiverAccountNo, amount, password } = req.body;

  const session = await mongoose.startSession(); // Start a session for transaction
  let transactionCommitted = false; // Track if the transaction is committed

  try {
    session.startTransaction(); // Begin the transaction

    // Check if OTP is valid
    const otpData = otpStore.get(transactionId);
    if (!otpData) {
      return res.status(400).json({ status: 400, message: 'Invalid or expired OTP.' });
    }

    // Validate OTP and account number
    if (otpData.otp !== parseInt(otp, 10) || otpData.accountNo !== accountNo) {
      return res.status(400).json({ status: 400, message: 'Invalid OTP.' });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(transactionId);
      return res.status(400).json({ status: 400, message: 'OTP expired.' });
    }

    // Validate sender account and password
    const sender = await Customer.findOne({ accountNo }).session(session);
    if (!sender) {
      return res.status(404).json({ status: 404, message: 'Sender account not found.' });
    }

    const isMatch = await bcrypt.compare(password, sender.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: 'Incorrect password.' });
    }

    // Check sender balance
    if (sender.balance < amount) {
      return res.status(400).json({ status: 400, message: 'Insufficient balance.' });
    }

    // Validate receiver account
    const receiver = await Customer.findOne({ accountNo: receiverAccountNo }).session(session);
    if (!receiver) {
      return res.status(404).json({ status: 404, message: 'Receiver account not found.' });
    }

    // Perform the transaction
    sender.balance -= amount;
    receiver.balance = parseInt(receiver.balance, 10) + parseInt(amount, 10);

    await sender.save({ session });
    await receiver.save({ session });

    // Record the transaction
    const transaction = new Transaction({
      transactionId,
      senderAccountNo: accountNo,
      receiverAccountNo,
      amount,
      transactionType: 'debit',
      transactionDate: new Date(),
    });

    await transaction.save({ session });

    await session.commitTransaction(); // Commit the transaction
    transactionCommitted = true; // Mark the transaction as committed
    session.endSession();

    otpStore.delete(transactionId); // Clean up OTP data

    // Email to the sender
    const senderInfo = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sender.email, // Sender's email address
      subject: 'Money Transfer Successful',
      text: `Dear ${sender.accountTitleEnglish},
  
        We are pleased to inform you that your money transfer has been successfully completed.
        
        Transaction Details:
        - Amount Transferred: BDT ${amount}
        - Receiver Account: ${receiverAccountNo}
        - Transaction ID: ${transactionId}
        - Transaction Date: ${new Date().toLocaleString()}
        
        If you have any questions or concerns, please contact our support team.
        
        Thank you for choosing Eastern Bank PLC for your banking needs.
        
        Best regards,
        Eastern Bank PLC (EBL)`,
      html: `<p>Dear ${sender.accountTitleEnglish},</p>
         <p>We are pleased to inform you that your money transfer has been successfully completed.</p>
         <h4>Transaction Details:</h4>
         <ul>
           <li><b>Amount Transferred:</b> BDT ${amount}</li>
           <li><b>Receiver Account:</b> ${receiverAccountNo}</li>
           <li><b>Transaction ID:</b> ${transactionId}</li>
           <li><b>Transaction Date:</b> ${new Date().toLocaleString()}</li>
         </ul>
         <p>If you have any questions or concerns, please contact our support team.</p>
         <p>Thank you for choosing Eastern Bank PLC for your banking needs.</p>
         <p>Best regards,</p>
         <p><b>Eastern Bank PLC (EBL)</b></p>`,
    });

    // Email to the receiver
    const receiverInfo = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiver.email, // Receiver's email address
      subject: 'Money Received Notification',
      text: `Dear ${receiver.name},
  
        Congratulations! You have received a money transfer to your account.
        
        Transaction Details:
        - Amount Received: BDT ${amount}
        - Sender Account: ${accountNo}
        - Transaction ID: ${transactionId}
        - Transaction Date: ${new Date().toLocaleString()}
        
        If you have any questions or concerns, please contact our support team.
        
        Thank you for choosing Eastern Bank PLC for your banking needs.
        
        Best regards,
        Eastern Bank PLC (EBL)`,
      html: `<p>Dear ${receiver.name},</p>
         <p>Congratulations! You have received a money transfer to your account.</p>
         <h4>Transaction Details:</h4>
         <ul>
           <li><b>Amount Received:</b> BDT ${amount}</li>
           <li><b>Sender Account:</b> ${accountNo}</li>
           <li><b>Transaction ID:</b> ${transactionId}</li>
           <li><b>Transaction Date:</b> ${new Date().toLocaleString()}</li>
         </ul>
         <p>If you have any questions or concerns, please contact our support team.</p>
         <p>Thank you for choosing Eastern Bank PLC for your banking needs.</p>
         <p>Best regards,</p>
         <p><b>Eastern Bank PLC (EBL)</b></p>`,
    });

    console.log('Sender email sent: %s', senderInfo.messageId);
    console.log('Receiver email sent: %s', receiverInfo.messageId);


    res.status(200).json({ status: 200, message: 'Money transferred successfully.' });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction(); // Abort only if not already committed
    }
    session.endSession();
    console.error('Error verifying OTP:', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
};





//Reset password

let otpCache = {}; // Temporary in-memory storage for OTPs

/**
 * Generate a secure OTP
 */
const generateOtpCode = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};

/**
 * Send an OTP to the provided email
 */
exports.sendResetOtpCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Generate OTP
    const otpCode = generateOtpCode();
    otpCache[email] = { code: otpCode, expiresAt: Date.now() + 10 * 60 * 1000 }; // Store OTP with expiry time


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code for Secure Banking",
      text: `Dear Customer,
    
            Your OTP code is ${otpCode}. It is valid for 10 minutes. Please use this code to complete your secure banking transaction.
            
            If you did not request this OTP, please contact our support team immediately.
    
            Thank you for choosing Eastern Bank PLC for your banking needs.
    
            Best regards,
            Eastern Bank PLC (EBL)`,
      html: `<p>Dear Customer,</p>
             <p>Your OTP code is <b>${otpCode}</b>. It is valid for 10 minutes. Please use this code to complete your secure banking transaction.</p>
             <p><i>If you did not request this OTP, please contact our support team immediately.</i></p>
             <p>Thank you for choosing Eastern Bank PLC for your banking needs.</p>
             <p>Best regards,</p>
             <p><b>Eastern Bank PLC (EBL)</b></p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyResetOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtp = otpCache[email];

  if (!storedOtp) {
    return res.status(400).json({ message: "No OTP found for this email" });
  }

  if (Date.now() > storedOtp.expiresAt) {
    delete otpCache[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (storedOtp.code !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpCache[email]; // Clear OTP after successful verification
  res.status(200).json({ message: "OTP verified successfully" });
};


exports.newPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const user = await Customer.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Recipient address
      subject: "Your Password Has Been Successfully Changed", // Subject line
      text: `Dear Customer,
    
            Your password has been successfully changed. If you did not request this change, please contact our support team immediately.
    
            Thank you for choosing Eastern Bank PLC for your banking needs.
    
            Best regards,
            Eastern Bank PLC (EBL)`, // Plain text body
      html: `<p>Dear Customer,</p>
             <p>Your password has been successfully changed. If you did not request this change, please contact our support team immediately.</p>
             <p>Thank you for choosing Eastern Bank PLC for your banking needs.</p>
             <p>Best regards,</p>
             <p><b>Eastern Bank PLC (EBL)</b></p>`, // HTML body
    };


    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Password reset confirmation email sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};





exports.getTransactionHistory = async (req, res) => {
  const { accountNo } = req.params;

  try {
    const transactions = await Transaction.find({
      $or: [{ senderAccountNo: accountNo }, { receiverAccountNo: accountNo }],
    }).sort({ transactionDate: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ status: 404, message: 'No transactions found.' });
    }

    return res.status(200).json({
      status: 200,
      message: 'Transaction history retrieved successfully.',
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.passwordChange = async (req, res) => {
  const { accountNo, oldPassword, newPassword } = req.body;
  try {
    const customer = await Customer.findOne({ accountNo });
    if (!customer) {
      return res.status(404).json({
        status: 404,
        message: 'Account not found.',
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: 'Incorrect password.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;
    await customer.save();

    const info = {
      from: process.env.EMAIL_USER, // Sender address
      to: customer.email, // Recipient address
      subject: "Your Password Has Been Successfully Changed", // Subject line
      text: `Dear Customer,
    
            Your password has been successfully changed. If you did not request this change, please contact our support team immediately.
    
            If you need further assistance, please feel free to reach out to us at our customer support team.
    
            Thank you for choosing Eastern Bank PLC for your banking needs.
    
            Best regards,
            Eastern Bank PLC (EBL)`, // Plain text body
      html: `<p>Dear Customer,</p>
             <p>Your password has been successfully changed. If you did not request this change, please contact our support team immediately.</p>
             <p>If you need further assistance, please feel free to reach out to us at our customer support team.</p>
             <p>Thank you for choosing <b>Eastern Bank PLC (EBL)</b> for your banking needs.</p>
             <p>Best regards,</p>
             <p><b>Eastern Bank PLC (EBL)</b></p>`, // HTML body
    };

    await transporter.sendMail(info);


    return res.status(200).json({
      status: 200,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


exports.transferMoney = async (req, res) => {
  const { accountNo, receiverAccountNo, amount, password } = req.body;

  try {
    // Validate sender account
    const sender = await Customer.findOne({ accountNo });
    if (!sender) {
      return res.status(404).json({
        status: "Not Found",
        message: "Sender account not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, sender.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Incorrect password.",
      });
    }

    console.log('Sender:', sender);

    // Check if sender has enough balance
    if (sender.balance < amount) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Insufficient balance.",
      });
    }

    // Validate receiver account
    const receiver = await Customer.findOne({ accountNo: receiverAccountNo });
    if (!receiver) {
      return res.status(404).json({
        status: "Not Found",
        message: "Receiver account not found.",
      });
    }

    // Perform the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Deduct amount from sender's account
      sender.balance -= amount;
      await sender.save({ session });

      // Add amount to receiver's account
      receiver.balance += amount;
      await receiver.save({ session });

      // Record the transaction
      const transaction = new Transaction({
        transactionId: new mongoose.Types.ObjectId().toString(),
        senderAccountNo: sender.accountNo,
        receiverAccountNo: receiver.accountNo,
        amount,
        transactionType: "debit",
        transactionDate: new Date(),
      });
      await transaction.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        status: "Success",
        message: "Transfer successful.",
        data: {
          sender: { accountNo: sender.accountNo, balance: sender.balance },
          receiver: { accountNo: receiver.accountNo, balance: receiver.balance },
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error during transfer:", error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred during the transaction.",
      error: error.message,
    });
  }
};



exports.transaaaferMoney = (req, res) => {
  const { account_no, receiverAccountNo, amount, password } = req.body;
  try {
    connection.query("SELECT * FROM `customer` WHERE `account_no` = ? AND `password` = ?", [account_no, password], (err, result, fields) => {
      if (err) {
        response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
      } else {
        if (result.length > 0) {
          if (result[0].balance < amount) {
            response(res, 400, "Bad Request", "Insufficient Balance", "Insufficient Balance", null);
          } else {
            connection.query("SELECT * FROM `customer` WHERE `account_no` = ?", [receiverAccountNo], (err, result, fields) => {
              if (err) {
                response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
              }
              if (result.length > 0) {
                connection.beginTransaction();
                connection.query("UPDATE `customer` SET `balance` = `balance` + ? WHERE `account_no` = ?", [amount, receiverAccountNo], (err, result, fields) => {
                  if (err) {
                    response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
                  }
                  if (result.changedRows > 0) {
                    connection.query(
                      "INSERT INTO `transactions` VALUES (?,?,?,?,?,?)",
                      [
                        "",
                        account_no,
                        receiverAccountNo,
                        amount,
                        "Send Money",
                        new Date(),
                      ],
                      (err, result, fields) => {
                        if (err) {
                          connection.rollback();
                          response(
                            res,
                            500,
                            "Internal Server Error",
                            "Internal Server Error",
                            err.message,
                            null
                          );
                        }
                        connection.query(
                          "UPDATE `customer` SET `balance` = `balance` - ? WHERE `account_no` = ?",
                          [amount, account_no],
                          (err, result, fields) => {
                            if (err) {
                              connection.rollback();
                              response(
                                res,
                                500,
                                "Internal Server Error",
                                "Internal Server Error",
                                err.message,
                                null
                              );
                            }
                            if (result.affectedRows > 0) {
                              connection.commit();
                              response(
                                res,
                                200,
                                "OK",
                                "Money Transfered",
                                "Money Transfered",
                                null
                              );
                            } else {
                              connection.rollback();
                              response(
                                res,
                                500,
                                "Internal Server Error",
                                "Internal Server Error",
                                "Transfer Failed",
                                null
                              );
                            }
                          }
                        );
                      }
                    );
                  } else {
                    response(
                      res,
                      500,
                      "Internal Server Error",
                      "Internal Server Error",
                      "Transfer Failed",
                      null
                    );
                  }
                })
              } else {
                response(res, 404, "Not Found", "No Account Found", "No Account Found", null);
              }

            })
          }
        } else {
          response(res, 404, "Not Found", "Password Wrong", "Password Wrong", null);
        }
      }
    })
  } catch (error) {
    response(
      res,
      500,
      "Internal Server Error",
      "Internal Server Error",
      error.message,
      null
    );
  }


  // try {
  //   connection.query("SELECT * FROM `customer` WHERE `account_no` = ?", [account_no], (err, result, fields) => {
  //     if(err){
  //       response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
  //     }
  //     if(result.length > 0){
  //       if(result[0].balance < amount){
  //         response(res, 400, "Bad Request", "Insufficient Balance", "Insufficient Balance", null);
  //       }else{
  //         connection.query("SELECT * FROM `customer` WHERE `account_no` = ?", [receiverAccountNo], (err, result, fields) => {
  //           if(err){
  //             response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
  //           }
  //           if(result.length > 0){
  //             connection.beginTransaction();
  //             connection.query("UPDATE `customer` SET `balance` = `balance` + ? WHERE `account_no` = ?", [amount, receiverAccountNo], (err, result, fields) => {
  //               if(err){
  //                 response(res, 500, "Internal Server Error", "Internal Server Error", err.message, null);
  //               }
  //               if(result.affectedRows > 0){
  //                 connection.query(
  //                   "INSERT INTO `transactions` VALUES (?,?,?,?,?,?)",
  //                   [account_no, receiverAccountNo, amount, "Send Money", new Date()],
  //                   (err, result, fields) => {
  //                     if (err) {
  //                       connection.rollback();
  //                       response(
  //                         res,
  //                         500,
  //                         "Internal Server Error",
  //                         "Internal Server Error",
  //                         err.message,
  //                         null
  //                       );
  //                     }
  //                     connection.query(
  //                       "UPDATE `customer` SET `balance` = `balance` - ? WHERE `account_no` = ?",
  //                       [amount, account_no],
  //                       (err, result, fields) => {
  //                         if (err) {
  //                           connection.rollback();
  //                           response(
  //                             res,
  //                             500,
  //                             "Internal Server Error",
  //                             "Internal Server Error",
  //                             err.message,
  //                             null
  //                           );
  //                         }
  //                         if (result.affectedRows > 0) {
  //                           connection.commit();
  //                           response(
  //                             res,
  //                             200,
  //                             "OK",
  //                             "Transfer Successfull",
  //                             "Transfer Successfull",
  //                             null
  //                           );
  //                         } else {
  //                           connection.rollback();
  //                           response(
  //                             res,
  //                             500,
  //                             "Internal Server Error",
  //                             "Internal Server Error",
  //                             "Transfer Failed",
  //                             null
  //                           );
  //                         }
  //                       }
  //                     );
  //                   }
  //                 );
  //               }else{
  //                 response(res, 500, "Internal Server Error", "Internal Server Error", "Transfer Failed", null);
  //               }
  //             })
  //           }else{
  //             response(res, 404, "Not Found", "No Account Found", "No Account Found", null);
  //           }
  //         })
  //       }
  //     }else{
  //       response(res, 404, "Not Found", "No Account Found", "No Account Found", null);
  //     }
  //   })
  // } catch (error) {
  //   response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  // }
};
exports.getBalance = async (req, res) => {
  const { accountNo } = req.params;

  try {
    // Find the customer with the given account number
    const customer = await Customer.findOne({ accountNo: accountNo });

    if (!customer) {
      // If no customer found with the given account number
      return res.status(404).json({
        status: 404,
        message: 'Account not found.',
      });
    }

    // Return the balance of the found customer
    return res.status(200).json({
      status: 200,
      message: 'Balance retrieved successfully.',
      balance: customer.balance,
    });
  } catch (error) {
    // Handle errors such as database connection issues
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
exports.transitions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find().lean();
    if (allTransactions) {
      Response(res, 200, "OK", "All transactions found.", "All transactions found.", allTransactions);

    } else {
      Response(res, 404, "Not Found", "No transaction found.", "No transaction found.", null);
    }
  } catch (error) {
    console.error("Error getting all transactions:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  }
};
exports.inactive = async (req, res) => {
  const { accountNo } = req.params;
  try {
    const account = await Customer.findOne({ accountNo: accountNo });
    if (!account) {
      Response(res, 404, "Not Found", "Account not found.", "Account not found.", null);
      return;
    }
    account.status = "inactive";
    await account.save();
    Response(res, 200, "OK", "Account deactivated.", "Account deactivated.", null);
  } catch (error) {
    console.error("Error deactivating account:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
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

    // Generate password using birth year and some random characters
    const generatePassword = (dob) => {
      const birthYear = new Date(dob).getFullYear();  // Extract birth year from dob
      const randomChars = crypto.randomBytes(2).toString('hex');  // Generate 4 random characters
      return `${birthYear}${randomChars}`;  // Combine birth year and random characters
    };

    const newPassword = generatePassword(account.dob);  // Generate password with birth year

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    account.password = hashedPassword;

    await account.save();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: account.email, // list of receivers
      subject: "Account Active", // Subject line
      text: `Your account has been created. Your customer ID is: ${account.accountNo}`, // plain text body
      html: `<p>Your account has been Approved. Your Account No is: <strong>${account.accountNo}</strong></p><p>Your new password is: <strong>${newPassword}</strong></p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    Response(res, 200, "OK", "Account activated.", "Account activated.", null);
  }
  catch (error) {
    console.error("Error activating account:", error);
    Response(res, 500, "Internal Server Error", "Internal Server Error", error.message, null);
  }
}


exports.deleteAccount = async (req, res) => {
  const { accountNo } = req.params;

  // Input validation (ensure accountNo is provided)
  if (!accountNo) {
    return Response(res, 400, "Bad Request", "Account number is required.", "Account number is missing.", null);
  }

  try {
    // Try to delete the account
    const deletedAccount = await Customer.findOneAndDelete({ accountNo });

    // If no account is found
    if (!deletedAccount) {
      return Response(res, 404, "Not Found", "Account not found.", "No account found with the given account number.", null);
    }

    // Log successful deletion (useful for audit trails)
    console.log(`Account with accountNo ${accountNo} has been deleted.`);

    // Send successful response
    return Response(res, 200, "OK", "Account deleted successfully.", "The account was successfully deleted.", null);

  } catch (error) {
    console.error("Error deleting account:", error);

    // Return error response with detailed message
    return Response(res, 500, "Internal Server Error", "Error occurred while deleting account.", error.message, null);
  }
};


exports.updateAccount = (req, res) => {
  accountUpdate =
    "UPDATE customers SET name = 'NewNme', address = 'New Address', email = 'newemail@example.com', mobile = '555-555-5555', pin = 'newpin', balance = 1500.00, status = 'Active' WHERE customer_id = 18";
  accountUpdateValue = [];
  connection.query(accountUpdate, accountUpdateValue, (err, result, fields) => {
    if (err) {
      res.send(err);
    }
    if (result.changedRows > 0) {
      res.send("Updated");
    } else {
      res.send("No Change");
    }
  });
};
