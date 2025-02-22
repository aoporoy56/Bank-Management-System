import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../Context/UserProvider";

export default function AdminLogin() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if(userName === 'admin' && password === 'admin'){
      login("admin");
      toast.success("Login Success");
      window.location.href = "/admin";
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === "admin") {
      navigate("/admin");
    }
  }, [navigate]);
  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 border mt-5 p-5">
          <h2 className="text-center">Admin Login</h2>
          <Form noValidate onSubmit={handleSubmit} className="mt-4">
            <Form.Group className="mb-3" controlId="validationCustom03">
              <Form.Control
                required
                type="text"
                placeholder="User Name"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom03">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Button type="submit">Login</Button>
            <p className="mt-3">
              {/* Create a Account? <Link to={"/customer/register"}>Signup</Link>{" "} */}
            </p>
          </Form>
        </div>
      </Row>
    </div>
  );
}
