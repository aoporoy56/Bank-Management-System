import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserProvider";
import { FaUsers, FaSearch, FaSignOutAlt, FaMoneyBillWave, FaPlusCircle } from "react-icons/fa"; // Importing React Icons

export default function AdminDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="container border mt-5 p-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="row d-flex justify-content-center">
        {/* Application List Card */}
        <div className="col-md-4 mb-3">
          <Link to="/admin/allaccountlist" className="text-decoration-none">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaUsers size={50} className="mb-3" /> {/* Application List Icon */}
                <h5 className="card-title">Application List</h5>
                <p className="card-text">View and manage all account applications.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Search Account Card */}
        <div className="col-md-4 mb-3">
          <Link to="/admin/searchAccount" className="text-decoration-none">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaSearch size={50} className="mb-3" /> {/* Search Account Icon */}
                <h5 className="card-title">Search Account</h5>
                <p className="card-text">Find account details quickly.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Deposit Money Card */}
        <div className="col-md-4 mb-3">
          <Link to="/admin/depositMoney" className="text-decoration-none">
            <div className="card shadow text-center">
              <div className="card-body">
                <FaPlusCircle size={50} className="mb-3" /> {/* Deposit Money Icon */}
                <h5 className="card-title">Deposit Money</h5>
                <p className="card-text">Deposit money into a specific account.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Logout Card */}
        <div className="col-md-4 mb-3">
          <div
            className="card shadow text-center"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <div className="card-body">
              <FaSignOutAlt size={50} className="mb-3" /> {/* Logout Icon */}
              <h5 className="card-title">Logout</h5>
              <p className="card-text">Sign out from the admin dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
