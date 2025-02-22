import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DepositMoney() {
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for account number and amount
    if (!accountNo || !amount || isNaN(amount) || amount <= 0) {
      alert("Please provide valid account number and amount.");
      return;
    }

    // Call the API to deposit money (replace with your actual API)
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/admin/depositMoney`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNo,
          amount,
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Money deposited successfully.");
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        toast.error(data.message || "Failed to deposit money.");
      }
    } catch (error) {
      console.error("Error depositing money:", error);
      toast.error("Error occurred. Please try again.");
    }
  };

  return (
    <div className="container border mt-5 p-5">
      <h2 className="text-center mb-4">Deposit Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="accountNo" className="form-label">Account Number</label>
          <input
            type="text"
            id="accountNo"
            className="form-control"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Deposit Amount (BDT)</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Deposit</button>
      </form>
    </div>
  );
}
