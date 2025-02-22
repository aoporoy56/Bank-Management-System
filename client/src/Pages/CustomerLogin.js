import React, { useState } from "react";
import { Form, Button, Row, Spinner, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserProvider";
import { toast } from "react-toastify";

export default function CustomerLogin() {
  const [accountNo, setAccountNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [validated, setValidated] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Trigger form validation
    if (form.checkValidity() === false) {
      setValidated(true); // Set form to validated state if any field is invalid
      return;
    }

    setIsLoading(true);

    const data = { accountNo, password };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/customer/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log("Response:", result);

      if (response.status === 200) {
        toast.success(`Welcome, ${result.data.account.accountTitleEnglish}!`);
        login(result.data.account.accountNo);
        navigate("/customer");
      } else if (response.status === 401) {
        toast.error("Invalid account number or password");
      } else if (response.status === 403) {
        toast.error("Account is not activated yet. Please contact the Bank.");
      } else if (response.status === 404) {
        toast.error("Account not found. Please check your account number.");
      } else if (response.status === 500) {
        toast.error("Something went wrong with the server. Please try again later.");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong with the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 border mt-5 p-5">
          <h2 className="text-center">Customer Login</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
            <Form.Group className="mb-3" controlId="accountNo">
              <Form.Control
                required
                type="text"
                placeholder="Account No"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Account number is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters long.
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" disabled={isLoading} className="w-100">
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Row>
              <Col md={6} className="mt-3">
                <p className="mt-3">
                  Forgot Password? <Link to={"/customer/reset"}>Reset Password</Link>
                </p>
              </Col>
              <Col md={6} className="mt-3">
                <p className="mt-3">
                  Create an Account? <Link to={"/customer/register"}>Signup</Link>
                </p>
              </Col>
            </Row>
          </Form>
        </div>
      </Row>
    </div>
  );
}
