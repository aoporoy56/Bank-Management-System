import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../Context/UserProvider';

const CustomerTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/customer/getTransactionDetails/${user}`
        );
        if (response.status === 200) {
          setTransactions(response.data.data);
          setFilteredTransactions(response.data.data);
        }else if(response.status == 404){
          setError('No transactions found.');
        } else {
          setError('Failed to retrieve transaction history.');
        }
      } catch (error) {
        setError('Error fetching transaction history.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [user]);

  const filterTransactions = (searchQuery, transactionType, minAmount, maxAmount) => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.senderAccountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.receiverAccountNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        transactionType === 'all' ||
        (transactionType === 'debit' && transaction.senderAccountNo === user) ||
        (transactionType === 'credit' && transaction.senderAccountNo !== user);

      const matchesAmount =
        (minAmount ? transaction.amount >= parseFloat(minAmount) : true) &&
        (maxAmount ? transaction.amount <= parseFloat(maxAmount) : true);

      return matchesSearch && matchesType && matchesAmount;
    });

    setFilteredTransactions(filtered);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    filterTransactions(value, transactionTypeFilter, minAmount, maxAmount);
  };

  const handleTransactionTypeChange = (event) => {
    const value = event.target.value;
    setTransactionTypeFilter(value);
    filterTransactions(searchQuery, value, minAmount, maxAmount);
  };

  const handleAmountFilter = () => {
    filterTransactions(searchQuery, transactionTypeFilter, minAmount, maxAmount);
  };

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionModal = () => {
    setSelectedTransaction(null);
  };



  return (
    <div className="container mt-4">
  <h2 className="text-center mb-4">Transaction History</h2>

  <div className="row d-flex mb-4">
    <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
      <label>Search:</label>
      <input
        type="text"
        className="form-control"
        placeholder="Search by Transaction ID, Sender, or Receiver"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
      <label>Transaction Type:</label>
      <select
        className="form-control"
        value={transactionTypeFilter}
        onChange={handleTransactionTypeChange}
      >
        <option value="all">All</option>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>
    </div>
    <div className="col-lg-4 col-md-5 col-sm-12 mb-3">
      <label>Amount Range:</label>
      <div className="d-flex">
        <input
          type="number"
          className="form-control mr-2"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
        <button className="btn btn-primary ml-2" onClick={handleAmountFilter}>
          Apply
        </button>
      </div>
    </div>
  </div>

  <div className="table-responsive">
    <table className="table table-bordered table-striped table-hover">
      <thead className="thead-dark">
        <tr>
          <th>Transaction ID</th>
          <th>Sender Account</th>
          <th>Receiver Account</th>
          <th>Amount</th>
          <th>Transaction Type</th>
          <th>Transaction Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <tr key={transaction._id} onClick={() => openTransactionModal(transaction)}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.senderAccountNo}</td>
              <td>{transaction.receiverAccountNo}</td>
              <td>{transaction.amount}</td>
              <td>
                <span
                  className={`badge ${
                    transaction.senderAccountNo === user ? 'bg-danger' : 'bg-success'
                  }`}
                >
                  {transaction.senderAccountNo === user ? 'Debit' : 'Credit'}
                </span>
              </td>
              <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">
              No transactions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default CustomerTransactionHistory;
