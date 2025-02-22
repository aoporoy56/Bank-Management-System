import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import AccountPreview from './AccountPreview'; // Assuming AccountPreview is in the same directory

const SearchAccount = () => {
    const [accountNo, setAccountNo] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const searchAccount = async (accountNo) => {
        
        // If validation passes, fetch account details from the server
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/customer/findAccount/${accountNo}`);
            const data = await res.json();

            if (data.status === 200) {
                setError(null); // Clear any previous error
            } else {
                setError('Account not found.');
            }
        } catch (err) {
            setError('An error occurred while fetching the account.');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission for searching an account
    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Perform basic validation to check if account number is not empty
        if (!accountNo) {
            setError('Please enter an account number.');
            setLoading(false);
            return;
        }

        // Assuming account number should be numeric and at least 6 digits long
        // if (!/^\d{6,}$/.test(accountNo)) {
        //     setError('Please enter a valid account number (at least 6 digits).');
        //     setLoading(false);
        //     return;
        // }

        searchAccount(accountNo);

    };

    useEffect(() => {
        if (accountNo) {
            searchAccount(accountNo);
        }
    }, [accountNo]);

    return (
        <div className="container mt-5">
            <h2>Search Account</h2>

            {/* Search Form */}
            <Form onSubmit={handleSearch}>
                <Row>
                    <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                        <Row className='d-flex align-items-end'>
                        <Col md={8}>
                        <Form.Group controlId="accountNo">
                            <Form.Label>Account Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Account Number"
                                value={accountNo}
                                onChange={(e) => setAccountNo(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Button variant="primary" type="submit" block disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>

            {/* Error or Success Message */}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {/* Display Account Details if Account is Found */}
            {accountNo && !error && (
                <div className="mt-5">
                    <AccountPreview accountNo={accountNo} />
                </div>
            )}
        </div>
    );
};

export default SearchAccount;
