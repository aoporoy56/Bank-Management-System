import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUser, FaMoneyCheck, FaBalanceScale, FaHistory, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../Context/UserProvider";

export default function CustomerDashboard() {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    // Fetch account data
    const fetchAccountData = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer/findAccount/ACC2024000003");
        const data = await response.json();
        if (data.status === 200) {
          setAccountData(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchAccountData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/customer/login");
  };

  const cards = [
    {
      title: "My Account",
      description: "View your account details and balance.",
      icon: <FaUser size={32} />,
      link: "/customer/myAccount",
    },
    {
      title: "Transfer Money",
      description: "Send money to another account.",
      icon: <FaMoneyCheck size={32} />,
      link: "/customer/transfer",
    },
    {
      title: "Balance",
      description: "Check your current account balance.",
      icon: <FaBalanceScale size={32} />,
      link: "/customer/balance",
    },
    {
      title: "All Transactions",
      description: "View your transaction history.",
      icon: <FaHistory size={32} />,
      link: "/customer/transactions",
    },
    {
      title: "Change Password",
      description: "Update your account password.",
      icon: <FaKey size={32} />,
      link: "/customer/changePassword",
    },
    {
      title: "Logout",
      description: "Logout securely from your account.",
      icon: <FaSignOutAlt size={32} />,
      action: handleLogout, // Executes logout instead of redirecting
    },
  ];

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h2 className="text-center mb-4">Customer Dashboard</h2>
        </Col>
      </Row>

      <Row>
        {cards.map((card, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <Card
              onClick={() => {
                if (card.link) navigate(card.link);
                if (card.action) card.action();
              }}
              className="text-center clickable-card"
              style={{ cursor: "pointer", border: "1px solid #ddd", transition: "transform 0.2s ease" }}
            >
              <Card.Body>
                <div className="icon mb-3">{card.icon}</div>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
