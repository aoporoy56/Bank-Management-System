import React, { useState, useEffect } from "react";
import { Form, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../Context/UserProvider";

export default function TransferMoney() {
  const [receiverAccountNo, setReceiverAccountNo] = useState("");
  const { user } = useUser();
  const [accountNo] = useState(user);
  const [receiverName, setReceiverName] = useState("");
  const [accountValid, setAccountValid] = useState(false);
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false); // State for OTP loading
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const findAccount = async (event) => {
    event.preventDefault();
    if (receiverAccountNo.length < 6) {
      toast.info("Account No must be 6 digits long");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/customer/findAccount/${receiverAccountNo}`
      );
      const result = await response.json();
      if (response.status === 200) {
        toast.success("Account Found");
        setReceiverName(result.data.accountTitleEnglish);
        setAccountValid(true);
      } else {
        toast.error(result.message || "Account Not Found");
        setReceiverName("");
        setAccountValid(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const sendOtp = async () => {
    if (resendTimer > 0 || otpLoading) return; // Prevent sending OTP if timer is active or loading
    setOtpLoading(true); // Start loading

    try {
      const data = { accountNo, password, receiverAccountNo, amount };
      const response = await fetch(
        "http://localhost:4000/customer/sendOtp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        toast.success("OTP sent to your email");
        setTransactionId(result.data.transactionId);
        setOtpSent(true);
        setResendTimer(120); // Start 2-minute countdown
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Something went wrong while sending OTP");
    } finally {
      setOtpLoading(false); // Stop loading
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();
    if (!otpSent) {
      sendOtp();
      return;
    }

    try {
      const data = { accountNo, receiverAccountNo, amount, password, otp, transactionId };
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/customer/transfer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      toast[result.status === 200 ? "success" : "error"](result.message);

      if (result.status === 200) {
        navigate("/customer");
      }else if (result.status === 400) {
        toast.error(result.message);
      }else{
        toast.error("Something went wrong while processing transfer");
      }
    } catch (err) {
      toast.error("Something went wrong while processing transfer");
    }
  };

  const isSendOtpDisabled = () => {
    return (
      receiverAccountNo.length < 6 ||
      amount === "" ||
      !accountValid ||
      resendTimer > 0 ||
      otpSent
    );
  };

  const isSendMoneyDisabled = () => {
    return !otpSent || otp === "" || password === "" || amount === "" || receiverAccountNo === "";
  };
  
  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 border mt-5 p-5">
          <h2 className="text-center">Money Transfer</h2>
          <Form noValidate onSubmit={handleTransfer} className="mt-4">
            <Row className="mb-3">
              <div className="col-md-8">
                <Form.Group controlId="validationCustom03">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Receiver Account No"
                    onChange={(e) => {
                      setReceiverAccountNo(e.target.value);
                      setAccountValid(false);
                      setOtpSent(false);
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Button
                  className="w-100"
                  onClick={findAccount}
                  disabled={otpSent}
                >
                  Find Account
                </Button>
              </div>
            </Row>
            <Form.Group className="mb-3">
              <Form.Control
                required
                type="text"
                placeholder="Account Holder Name"
                value={receiverName}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                required
                type="number"
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {otpSent && (
              <Form.Group className="mb-3">
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
            )}
            {otpSent && resendTimer > 0 && (
              <p className="text-muted">Resend OTP in {resendTimer} seconds</p>
            )}
            <Button
              type="button"
              className="mb-3 me-3"
              onClick={sendOtp}
              disabled={isSendOtpDisabled()}
            >
              {otpLoading ? "Sending OTP..." : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Send OTP"}
            </Button>
            <Button
              type="submit"
              className={otpSent ? "d-block" : "d-none"}
              disabled={isSendMoneyDisabled()}
            >
              Send Money
            </Button>
          </Form>
        </div>
      </Row>
    </div>
  );
}
