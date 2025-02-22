import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const CustomerInformation = ({ onCustomerInformationSubmit }) => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      banglaFullTitle: "",
      fatherName: "",
      motherName: "",
      spouseName: "",
      gender: "",
      dob: "",
      occupation: "",
      monthlyIncome: "",
      nationalId: "",
      email: "",
      phone1: "",
      phone2: "",
      presentAddress: "",
      permanentAddress: "",
      religion: '',          
      maritalStatus: '',   
    });
    const [validated, setValidated] = useState(false);
  
    const handleInputChange = (field, value) => {
      const updatedData = { ...formData, [field]: value };
      setFormData(updatedData);
      onCustomerInformationSubmit(field, value);
    };

    return (
        <Row className="d-flex justify-content-center">
            <div className="col-md-12 border mt-5 p-5">
                <h3 className="text-center">Customer Information</h3>

                {/* First Name and Last Name */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                First name is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last Name <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Last name is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Customer Name in Bangla and Father's Name */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="banglaFullTitle">
                            <Form.Label>Customer Name (in Bangla) <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Customer Name (in Bangla)"
                                value={formData.banglaFullTitle}
                                onChange={(e) => handleInputChange('banglaFullTitle', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Bangla full title is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="fatherName">
                            <Form.Label>Father's Name <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Father's Name"
                                value={formData.fatherName}
                                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Father's name is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Mother’s Name and Spouse’s Name */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="motherName">
                            <Form.Label>Mother's Name <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Mother's Name"
                                value={formData.motherName}
                                onChange={(e) => handleInputChange('motherName', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">Mother's name is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="spouseName">
                            <Form.Label>Spouse's Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Spouse's Name"
                                value={formData.spouseName}
                                onChange={(e) => handleInputChange('spouseName', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Religion and Marital Status Fields */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="religion">
                            <Form.Label>Religion <span className="required-asterisk">*</span></Form.Label>
                            <Form.Select
                                required
                                value={formData.religion}
                                onChange={(e) => handleInputChange('religion', e.target.value)}
                            >
                                <option value="">--SELECT--</option>
                                <option value="HINDU">Hindu</option>
                                <option value="ISLAM">Islam</option>
                                <option value="CHRISTIANITY">Christianity</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Religion is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="maritalStatus">
                            <Form.Label>Marital Status <span className="required-asterisk">*</span></Form.Label>
                            <Form.Select
                                required
                                value={formData.maritalStatus}
                                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                            >
                                <option value="">--SELECT--</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Marital status is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Other Fields */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender <span className="required-asterisk">*</span></Form.Label>
                            <Form.Select
                                required
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                            >
                                <option value="">--SELECT--</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Gender is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="dob">
                            <Form.Label>Date of Birth <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleInputChange('dob', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">Date of birth is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Occupation and Monthly Income */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="occupation">
                            <Form.Label>Occupation <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Occupation"
                                value={formData.occupation}
                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                isInvalid={validated && !formData.occupation}
                            />
                            <Form.Control.Feedback type="invalid">Occupation is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="monthlyIncome">
                            <Form.Label>Monthly Income <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Monthly Income"
                                value={formData.monthlyIncome}
                                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                                isInvalid={validated && !formData.monthlyIncome}
                            />
                            <Form.Control.Feedback type="invalid">Monthly income is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* National ID and Email */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="nationalId">
                            <Form.Label>National ID <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="National ID"
                                value={formData.nationalId}
                                onChange={(e) => handleInputChange('nationalId', e.target.value)}
                                isInvalid={validated && !formData.nationalId}
                            />
                            <Form.Control.Feedback type="invalid">National ID is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                isInvalid={validated && !formData.email}
                            />
                            <Form.Control.Feedback type="invalid">Email is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Phone Numbers */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone1">
                            <Form.Label>Phone Number 1 <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Phone Number 1"
                                value={formData.phone1}
                                onChange={(e) => handleInputChange('phone1', e.target.value)}
                                isInvalid={validated && !formData.phone1}
                            />
                            <Form.Control.Feedback type="invalid">Phone number 1 is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone2">
                            <Form.Label>Phone Number 2</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Phone Number 2"
                                value={formData.phone2}
                                onChange={(e) => handleInputChange('phone2', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Addresses */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="presentAddress">
                            <Form.Label>Present Address <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={4}
                                required
                                type="text"
                                placeholder="Present Address"
                                value={formData.presentAddress}
                                onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                                isInvalid={validated && !formData.presentAddress}
                            />
                            <Form.Control.Feedback type="invalid">Present address is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="permanentAddress">
                            <Form.Label>Permanent Address <span className="required-asterisk">*</span></Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={4}
                                required
                                type="text"
                                placeholder="Permanent Address"
                                value={formData.permanentAddress}
                                onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                isInvalid={validated && !formData.permanentAddress}
                            />
                            <Form.Control.Feedback type="invalid">Permanent address is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                
            </div>
        </Row>
    );
};

export default CustomerInformation;
