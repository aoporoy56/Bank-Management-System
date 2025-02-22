import React, { useEffect, useState } from "react";
import { Table, Form, Container, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountNo, setAccountNo] = useState("");  // Added state for account number input
  const [isSearchClicked, setIsSearchClicked] = useState(false);  // Flag for showing table after search

  // Fetch transactions from the server based on account number
  const fetchTransactions = async (accountNo) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/transactionByAccountNo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountNo }),
        }
      );
      const data = await response.json();
      if (data.status === 200) {
        setTransactions(data.data);
        setFilteredTransactions(data.data);
      } else {
        toast.error("Failed to fetch transactions.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching transactions.");
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = transactions.filter((transaction) =>
      Object.values(transaction)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
    setFilteredTransactions(filtered);
  };

  // Handle account number input and trigger search
  const handleAccountSearch = () => {
    if (accountNo) {
      setIsSearchClicked(true);  // Show the transaction list only after the account number is entered
      fetchTransactions(accountNo);  // Fetch transactions for the entered account number
    } else {
      toast.error("Please enter an account number to search.");
    }
  };

  return (
    <Container>
      <Row className="mb-3 pt-5 text-center">
        <Col>
          <h2>Transaction List</h2>
        </Col>
      </Row>

      {/* Account Number Input Field */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Enter Account No"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={handleAccountSearch} className="w-100">Search</Button>
        </Col>
      </Row>

      {/* Transaction Table Display after Search */}
      {(
        <>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Search by any field (e.g., transaction ID, type, amount)"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Transaction ID</th>
                    <th>Sender Account</th>
                    <th>Receiver Account</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction._id}>
                      <td>{index + 1}</td>
                      <td>{transaction.transactionId}</td>
                      <td>{transaction.senderAccountNo}</td>
                      <td>{transaction.receiverAccountNo}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.transactionType}</td>
                      <td>
                        {new Date(transaction.transactionDate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
