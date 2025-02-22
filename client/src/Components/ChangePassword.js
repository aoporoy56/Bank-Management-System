import React, { useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user } = useUser();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/customer/passwordChange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNo: user,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        toast.success('Password changed successfully.');
        navigate('/customer');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      toast.error('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-6 border mt-5 p-5">
      <h2>Change Password</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="oldPassword">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="newPassword" className="mt-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Change Password
        </Button>
      </Form>
    </div>
  </Row>
</div>
  );
}
