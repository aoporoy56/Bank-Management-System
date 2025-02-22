import React, { useEffect, useState } from "react";
import { Form, Button, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserProvider";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {resetMail, passwordResetDone} = useUser();
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try { // Assume email is stored after OTP verification
      if (!resetMail) {
        toast.error("Session expired. Please try resetting your password again.");
        return;
      }
      console.log("Reset Mail:", resetMail);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/customer/reset/newPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email:resetMail, password }),
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        passwordResetDone();
        navigate("/customer/login"); // Redirect to login page
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!resetMail) {
      navigate("/customer/reset");
    }
  }, [resetMail, navigate]);

  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 border mt-5 p-5">
          <h2 className="text-center">Reset Password</h2>
          <Form className="mt-4">
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              onClick={handlePasswordReset}
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Form>
        </div>
      </Row>
    </div>
  );
}
