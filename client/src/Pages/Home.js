import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#edf2f4" }}
    >
      <div className="text-center mb-5" style={{ color: "#0d47a1" }}>
        <h1 className="mb-4">Welcome to Eastern Bank PLC
        </h1>
        <div className="row">
          <div className="col-md-6">
            <div className="card border-0 shadow-lg p-3 mb-5 bg-white rounded hover-card">
              <div className="card-body text-center">
                <h3 className="card-title">Customer</h3>
                <div className="d-flex justify-content-center my-3">
                  <Link to="/customer/login" className="me-2">
                    <button className="btn btn-warning">
                      Login
                    </button>
                  </Link>
                  <Link to="/customer/register">
                    <button className="btn btn-primary">
                      Signup
                    </button>
                  </Link>
                </div>
                <img
                  src="images/users-icon.png"
                  alt="customer icon"
                  className="img-fluid rounded mx-auto d-block"
                  style={{ height: "250px", transition: "transform 0.3s" }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-lg p-3 mb-5 bg-white rounded hover-card">
              <div className="card-body text-center">
                <h3 className="card-title">Admin</h3>
                <div className="d-flex justify-content-center my-3">
                  <Link to="/admin/login">
                    <button className="btn btn-primary">
                      Login
                    </button>
                  </Link>
                </div>
                <img
                  src="images/icon-admin.png"
                  alt="admin icon"
                  className="img-fluid rounded mx-auto d-block"
                  style={{ height: "250px", transition: "transform 0.3s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
