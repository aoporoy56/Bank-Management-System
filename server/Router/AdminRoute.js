const express = require("express");
const { allAccountList, getTransactionsByAccountNo, depositMoney } = require("../Controller/AdminController");
const { active, deleteAccount, inactive, transitions } = require("../Controller/CustomerController");
const AdminRouter = express.Router();


// AdminRouter.get("accountDetails/:account_no", (req, res) => {
//     res.send("Account Details");
// });
// AdminRouter.use("/activateAccount", )
// AdminRouter.use("/deactivateAccount", )
// AdminRouter.use("/deleteAccount", )
AdminRouter.get("/allAccountList", allAccountList)
AdminRouter.get("/allTransaction", transitions);
AdminRouter.get("/inactive/:accountNo", inactive);
AdminRouter.get("/active/:accountNo", active);
AdminRouter.get('/transactionByAccountNo', getTransactionsByAccountNo);
AdminRouter.post('/depositMoney', depositMoney);

AdminRouter.delete("/delete/:accountNo", deleteAccount);


module.exports = AdminRouter;