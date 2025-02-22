import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../Context/UserProvider';

const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();
  
  const fetchBalance = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/customer/balance/${user}`); 
        
        if (response.data.status === 200) {
          setBalance(response.data.balance); // Assuming the API response contains balance field
        } else {
          setError('Failed to retrieve balance.');
        }
      } catch (error) {
        setError('Error fetching balance.');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    // Function to fetch the account balance
    

    fetchBalance();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card text-center shadow-lg">
        <div className="card-header">
          <h4>Account Balance</h4>
        </div>
        <div className="card-body">
          <h3 className="card-title">
            {balance ? `${balance}.00 BDT` : 'No balance available'}
          </h3>
          <p className="card-text">This is your current account balance.</p>
          <button onClick={fetchBalance} className="btn btn-primary">Refresh</button>
        </div>
      </div>
    </div>
  );
};

export default Balance;
