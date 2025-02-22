import React, { useState } from "react";
import { Row, Form, Button, Alert, Spinner } from "react-bootstrap";

export default function Track() {
  const [accountId, setAccountId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrackStatus = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatus("");

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/customer/status/${accountId}`);

      const data = await response.json();
      if (response.status === 200) {
        setStatus(data.data);
      }else if (response.status === 400) {
        setError("Application not found.");
      }else if (response.status === 500) {
        setError("Application not found.");
      }else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 mt-5 p-5 inner-body">
          <h2 className="text-center" style={{ color: "#0d47a1" }}>
            Track Account Status
          </h2>

          <Form onSubmit={handleTrackStatus} >
            <Form.Group className="mb-3" controlId="accountId">
              <Form.Label>Enter Application ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !accountId}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Track Status"}
            </Button>
          </Form>

          {status && (
            <Alert variant={status === "active" ? "success" : status === "inactive" ? "danger" : "warning"} className="mt-3">
              Application Status: <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </div>
      </Row>
    </div>
  );
}
