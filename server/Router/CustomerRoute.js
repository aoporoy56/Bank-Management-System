const express = require("express");
const { createAccount, updateAccount, loginAccount, findAccount, transferMoney, balance, transitions, deactivate, active, allAccounts, checkStatus, sendOtp, verifyOtp, getTransactionHistory, getBalance, passwordChange, sendResetOtpCode, verifyResetOtp, newPassword } = require("../Controller/CustomerController");
const CustomerRouter = express.Router();

CustomerRouter.post("/create",createAccount);
CustomerRouter.post("/login",loginAccount);

CustomerRouter.get("/status/:id",checkStatus);
CustomerRouter.get("/:accountNo",findAccount);

// CustomerRouter.get("/",allAccounts);

CustomerRouter.use("/update",updateAccount);
//password change
CustomerRouter.post("/passwordChange",passwordChange);
CustomerRouter.post("/reset/sendOtp",sendResetOtpCode);
CustomerRouter.post("/reset/verifyOtp",verifyResetOtp);
CustomerRouter.post("/reset/newPassword", newPassword);
CustomerRouter.get("/findAccount/:accountNo",findAccount);
CustomerRouter.post("/sendOtp",sendOtp);
CustomerRouter.post("/transfer",verifyOtp);
CustomerRouter.get("/getAccountDetails/:account_no",);
CustomerRouter.get("/getTransactionDetails/:accountNo",getTransactionHistory);
CustomerRouter.get("/balance/:accountNo",getBalance);
module.exports = CustomerRouter