import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, InputGroup, Modal } from "react-bootstrap";
import { UserState } from "../Context/UserProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerDeshboard() {
  const [validated, setValidated] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [accountData, setAccountData] = useState("");
  const navigate = useNavigate();
  const [show, setBalanceShow] = useState(false);
  const [balance, setBalance] = useState("");
  const user = localStorage.getItem("user");
  const showBalanceClose = () => setBalanceShow(false);
  const [transactionList, setTransactionList] = useState([]);
  const showBalance = async () => {
    await fetch("http://localhost:4000/customer/balance/" + user, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBalance(data.data.balance);
      });
    setBalanceShow(true);
  };

  const findAccount = async (event) => {
    await fetch("http://localhost:4000/customer/findAccount/" + user, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          // alert("Account Found");
          console.log(result.data);
          setAccountData(result.data);
          setShowAccount(true);
        }
      });
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const transactionShow = async (e) => {
    await fetch(
      "http://localhost:4000/customer/getTransactionDetails/" + user,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTransactionList(data.data);
        console.log(transactionList);
        setShowList(true);
      });
  };
  console.log(accountData);
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logout Successfully");
  };
  const hideList = () => {
    setShowList(false);
  };
  const hideAccount = () => {
    setShowAccount(false);
  };
  useEffect(() => {
    const checkUser = localStorage.getItem("user");
    if (!checkUser) {
      // navigate("/");
    }
  }, []);

  return (
    <div>
      <div className="container border mt-5 p-5">
        <h2>Customer Deshboard</h2>
        <div className="row">
          {/* <div className="col-md-3">
            <div className="customer-card">
              <img
                src="images/withdraw.png"
                alt="Avatar"
                class="avatar"
                width={"100%"}
              />
              <div className="card-float">
                <h3>Withdraw</h3>
              </div>
            </div>
          </div> */}
          <div
            onClick={() => navigate("/customer/transfer")}
            className="col-md-3"
          >
            <div className="customer-card">
              <img
                src="images/money_transfar.png"
                alt="Avatar"
                class="avatar"
                width={"100%"}
              />
              <div className="card-float">
                <h3>Transfer</h3>
              </div>
            </div>
          </div>
          <div onClick={showBalance} className="col-md-3">
            <div className="customer-card">
              <img
                src="images/balance.png"
                alt="Avatar"
                class="avatar"
                width={"100%"}
              />
              <div className="card-float">
                <h3>Balance</h3>
              </div>
            </div>
          </div>
          <div onClick={findAccount} className="col-md-3">
            <div className="customer-card">
              <img
                src="images/my-account.png"
                alt="Avatar"
                class="avatar"
                width={"100%"}
              />
              <div className="card-float">
                <h3>My Account</h3>
              </div>
            </div>
          </div>
          <div onClick={transactionShow} className="col-md-3">
            <div className="customer-card">
              <img
                src="images/transfer_history.png"
                alt="Avatar"
                class="avatar"
                width={"100%"}
              />
              <div className="card-float">
                <h3>All Transaction</h3>
              </div>
            </div>
          </div>
          <div onClick={logout} className="col-md-3">
            <div className="customer-card">
              <img
                src="images/logout.png"
                alt="Avatar"
                class="avatar"
                width={"100%"}
              />
              <div className="card-float">
                <h3>Logout</h3>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showList} onHide={hideList} style={{ minWidth: "1000px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Transactions</Modal.Title>
          </Modal.Header>
          <div class="container">
            <h2 className="text-center mb-3">Transaction List</h2>
            <div class="table-responsive">
              <table class="table table-striped table-bordered">
                <thead class="table-light">
                  <tr>
                    <td>#</td>
                    <td>Transaction ID</td>
                    <td>Account No</td>
                    <td>Receiver Account No</td>
                    <td>Amount</td>
                    <td>TYPE</td>
                    <td>Transaction Date</td>
                  </tr>
                </thead>
                <tbody>
                  {transactionList != "" &&
                    transactionList.map((list, index) => {
                      const timestampString = list.transaction_date;
                      const date = new Date(timestampString);

                      const day = date.getUTCDate();
                      const month = date.getUTCMonth() + 1; // Months are zero-based, so we add 1
                      const year = date.getUTCFullYear();

                      // Padding single-digit day/month with leading zeros
                      const formattedDate = `${day
                        .toString()
                        .padStart(2, "0")}-${month
                        .toString()
                        .padStart(2, "0")}-${year}`;

                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{list.transition_id}</td>
                          <td>{list.account_no}</td>
                          <td>{list.receiver_account_no}</td>
                          <td>{list.amount}</td>
                          <td>{list.type}</td>
                          <td>{formattedDate}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideList}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={show} onHide={showBalanceClose}>
          <Modal.Header closeButton>
            <Modal.Title>Balance</Modal.Title>
          </Modal.Header>
          <Modal.Body>{balance}TK</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={showBalanceClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {accountData != "" && (
          <Modal show={showAccount} onHide={hideAccount}>
            <Modal.Header closeButton>
              <Modal.Title>Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="table-responsive">
                <table class="table table-striped table-bordered">
                  <tr>
                    <td>account_no</td>
                    <td>{accountData.account_no}</td>
                  </tr>
                  <tr>
                    <td>full_name</td>
                    <td>{accountData.full_name}</td>
                  </tr>
                  <tr>
                    <td>address</td>
                    <td>{accountData.address}</td>
                  </tr>
                  <tr>
                    <td>email</td>
                    <td> {accountData.email}</td>
                  </tr>
                  <tr>
                    <td>phone</td>
                    <td>{accountData.phone}</td>
                  </tr>
                  <tr>
                    <td>nid</td>
                    <td>{accountData.nid}</td>
                  </tr>
                  <tr>
                    <td>gender</td>
                    <td>{accountData.gender}</td>
                  </tr>
                  <tr>
                    <td>STATUS</td>
                    <td>{accountData.STATUS}</td>
                  </tr>
                  <tr>
                    <td>created_at</td>
                    <td>{accountData.created_at}</td>
                  </tr>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={hideAccount}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* 
        <div className="collapse" id="collapseExample">
          <div className="form-group shadow p-3 mb-5 bg-white rounded mt-3">
            <label>Customer Id</label>
            <input
              type="text"
              value={id}
              className="form-control mb-3"
              id="customer_id_value"
              name="username"
              aria-describedby="emailHelp"
              disabled
              required
            />
            <label>Balance</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              onChange={(e) => setBalance(e.target.value)}
              required
            />

            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={AddAccount}
            >
              Add
            </button>
          </div>
        </div>

        <div class="collapse" id="alltransaction">
          <div class="card card-body">
            Your Transactions
            <table class="table">
              <thead class="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Account ID</th>
                  <th scope="col">Action</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Branch ID</th>
                  <th scope="col">Date of Transaction</th>
                </tr>
              </thead>
              <tbody>
                {Alltransaction.map((t) => (
                  <tr key={t.transaction_id}>
                    <td>{t.transaction_id}</td>
                    <td>{t.account_id}</td>
                    <td>{t.action}</td>
                    <td>{t.amount}</td>
                    <td>{t.branch_id}</td>
                    <td>{t.date_of_transaction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {MyAccounts.map((account) => (
          <form
            action="http://localhost:3000/customer/transaction"
            method="GET"
          >
            <div
              className="card shadow-lg p-3 mb-5 bg-white rounded collapse"
              id="AccountDetails"
              key={account.account_id}
            >
              <hr className="mt-5"></hr>
              <h1 style={{ textAlign: "left" }}>Savings Account</h1>
              <hr></hr>
              <div className="card-header">
                Account #{MyAccounts.indexOf(account) + 1}
              </div>
              <div className="card-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      @account no
                    </span>
                  </div>
                  <input
                    type="text"
                    value={account.account_id}
                    name="account_no"
                    className="form-control"
                    aria-describedby="basic-addon3"
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">₹</span>
                  </div>
                  <input
                    type="text"
                    value={account.current_balance}
                    className="form-control"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  <div className="input-group-append"></div>
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Date Opened</span>
                  </div>
                  <input
                    type="text"
                    value={
                      account.date_opened.substring(0, 10) +
                      " " +
                      account.date_opened.substring(11, 16)
                    }
                    className="form-control"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  <div className="input-group-append"></div>
                </div>
                <button className="btn btn-info" type="submit">
                  Transaction
                </button>
                <button
                  className="btn btn-danger ml-3"
                  onClick={() => DeleteAccount(account.account_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        ))} */}
      </div>
    </div>
  );
}
