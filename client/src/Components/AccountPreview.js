import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col, Button, Image, Table, Modal } from "react-bootstrap";

export default function AccountPreview({ accountNo }) {
    const [profile, setProfile] = useState(null);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);

    const getAccountProfile = async () => {
        setLoading(true);
        await fetch(`${process.env.REACT_APP_SERVER_URL}/customer/findAccount/${accountNo}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setProfile(data.data);
                    setTotalAccounts(data.data.totalAccounts || 0);
                } else {
                    console.error("Account not found.");
                }
            })
            .finally(() => setLoading(false));
    };

    const getTransactions = async () => {
        await fetch(`${process.env.REACT_APP_SERVER_URL}/customer/getTransactionDetails/${accountNo}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setTransactions(data.data);
                    calculateTotals(data.data);
                } else {
                    console.error("Transaction history not found.");
                }
            });
    };

    const calculateTotals = (transactions) => {
        let debit = 0;
        let credit = 0;
        transactions.forEach((transaction) => {
            if (transaction.senderAccountNo === accountNo) {
                debit += transaction.amount;
            } else if (transaction.receiverAccountNo === accountNo) {
                credit += transaction.amount;
            }
        });
        setTotalDebit(debit);
        setTotalCredit(credit);
    };

    useEffect(() => {
        getAccountProfile();
        getTransactions();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleImageClick = (imageUrl) => {
        setPreviewImage(imageUrl);
    };

    const handleClosePreview = () => {
        setPreviewImage(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Profile Preview</h2>
            {profile && (
                <Card>
                    <Card.Header>
                        <h4>Account Information</h4>
                    </Card.Header>
                    <Card.Body>
                        {/* Profile Image */}
                        <Row style={{ marginTop: "12px" }}>
                            <Col md={4}>
                                <Image
                                    src={profile.selfImageUrl}
                                    alt="Profile"
                                    roundedCircle
                                    fluid
                                    style={{ width: "150px", height: "150px", cursor: "pointer", objectFit: "cover" }}
                                    onClick={() => handleImageClick(profile.selfImageUrl)}
                                />
                            </Col>
                        </Row>

                        {/* Account Details */}
                        <Row style={{ marginTop: "12px" }}>
                            <Col md={6}>
                                <strong>Account No:</strong> {profile.accountNo}
                            </Col>
                            <Col md={6}>
                                <strong>Status:</strong>{" "}
                                <Badge bg={profile.status === "active" ? "success" : "danger"}>
                                    {profile.status}
                                </Badge>
                            </Col>
                            <Col md={6}>
                                <strong>Balance:</strong> {profile.balance} {profile.currency}
                            </Col>
                            <Col md={6}>
                                <strong>Total Debit:</strong> {totalDebit} {profile.currency}
                            </Col>
                            <Col md={6}>
                                <strong>Total Credit:</strong> {totalCredit} {profile.currency}
                            </Col>
                        </Row>

                        <hr />

                        {/* Personal Details */}
                        <h5>Personal Details</h5>
                        <Row>
                            <Col md={6}>
                                <strong>Full Name:</strong> {profile.firstName} {profile.lastName}
                            </Col>
                            <Col md={6}>
                                <strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}
                            </Col>
                            <Col md={6}>
                                <strong>Occupation:</strong> {profile.occupation}
                            </Col>
                            <Col md={6}>
                                <strong>Monthly Income:</strong> {profile.monthlyIncome} {profile.currency}
                            </Col>
                            <Col md={6}>
                                <strong>Marital Status:</strong> {profile.maritalStatus}
                            </Col>
                        </Row>

                        <hr />

                        {/* National ID Details */}
                        <h5>National ID</h5>
                        <Row>
                            <Col md={6}>
                                <strong>National ID:</strong> {profile.nationalId}
                            </Col>
                            <Col md={6}>
                                <Image
                                    src={profile.nidImageUrl}
                                    alt="National ID"
                                    rounded
                                    fluid
                                    style={{ width: "150px", height: "100px", cursor: "pointer" }}
                                    onClick={() => handleImageClick(profile.nidImageUrl)}
                                />
                            </Col>
                        </Row>

                        <hr />

                        {/* Nominee Details */}
                        <h5>Nominee Details</h5>
                        {profile.nomineeName ? (
                            <Row>
                                <Col md={6}>
                                    <strong>Nominee Name:</strong> {profile.nomineeName}
                                </Col>
                                <Col md={6}>
                                    <strong>Relationship:</strong> {profile.relationshipWithAccountHolder}
                                </Col>
                                <Col md={6}>
                                    <strong>Nominee Address:</strong> {profile.nomineeAddress}
                                </Col>
                            </Row>
                        ) : (
                            <p>No nominee details available.</p>
                        )}

                        <hr />

                        {/* Signature */}
                        <h5>Signature</h5>
                        {profile.signatureImageUrl ? (
                            <Image
                                src={profile.signatureImageUrl}
                                alt="Signature"
                                fluid
                                style={{ width: "250px", height: "100px", cursor: "pointer" }}
                                onClick={() => handleImageClick(profile.signatureImageUrl)}
                            />
                        ) : (
                            <p>No signature available.</p>
                        )}

                        <hr />

                        {/* Transaction Details */}
                        <h5>Transaction History</h5>
                        <p>Debit 
                            <Badge bg="danger" style={{ marginLeft: "4px" }}>
                                {totalDebit} {profile.currency}
                            </Badge>
                        </p>
                        <p>Credit
                            <Badge bg="success" style={{ marginLeft: "4px" }}>
                                {totalCredit} {profile.currency}
                            </Badge>
                        </p>
                        <p> Balance 
                            <Badge bg="primary" style={{ marginLeft: "4px" }}>
                                {profile.balance} {profile.currency}
                            </Badge>
                        </p>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Sender Account</th>
                                    <th>Receiver Account</th>
                                    <th>Transaction Type</th>
                                    <th>Amount</th>
                                    <th>Transaction Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.transactionId}>
                                        <td>{transaction.transactionId}</td>
                                        <td>{transaction.senderAccountNo}</td>
                                        <td>{transaction.receiverAccountNo}</td>
                                        <td>
                                            <Badge bg={transaction.senderAccountNo === accountNo ? "danger" : "success"}>
                                            {transaction.senderAccountNo === accountNo ? "Debit" : "Credit"}
                                            </Badge>
                                        </td>
                                        <td>{transaction.amount}</td>
                                        <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Print Button */}
                        <Button variant="secondary" onClick={handlePrint} style={{ marginTop: "12px" }}>
                            Print
                        </Button>
                    </Card.Body>
                </Card>
            )}

            {/* Image Preview Modal */}
            <Modal show={!!previewImage} onHide={handleClosePreview} centered>
                <Modal.Body>
                    <Image src={previewImage} alt="Preview" fluid />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePreview}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
