import React, { useState } from "react";
import { Form, Button, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../Context/UserProvider";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { passwordReset } = useUser();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/customer/reset/sendOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        toast.success("OTP sent to your email.");
        setIsOtpSent(true);
      } else {
        toast.error(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/customer/reset/verifyOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const result = await response.json();

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        passwordReset(email);
        navigate("/customer/new-password");
      } else {
        toast.error(result.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 border mt-5 p-5">
          <h2 className="text-center">Reset Password</h2>
          <Form className="mt-4">
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isOtpSent}
              />
            </Form.Group>
            {isOtpSent && (
              <Form.Group className="mb-3" controlId="otp">
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
            )}
            <Button
              onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : isOtpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </Button>
          </Form>
        </div>
      </Row>
    </div>
  );
}
