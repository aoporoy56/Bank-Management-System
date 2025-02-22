import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export default function NomineeInformation({ onNomineeInformationSubmit }) {
  const [formData, setFormData] = useState({
    nomineeName: "",
    relationshipWithAccountHolder: "Spouse/Child",
    nomineeDob: "",
    nomineePercentage: "",
    nomineeNationalId: "",
    nomineeIdType: "NID",
    nomineeOtherIdType: "",
    nomineeOtherIdDescription: "",
    nomineeAddress: "",
    isNomineeUnder18: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    // Send field and value to parent
    onNomineeInformationSubmit(name, updatedValue);
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    if (!value && ["nomineeName", "relationshipWithAccountHolder", "nomineeDob", "nomineePercentage", "nomineeNationalId", "nomineeAddress"].includes(name)) {
      errorMessage = "This field is required.";
    } else if (name === "nomineePercentage" && (value < 0 || value > 100)) {
      errorMessage = "Percentage must be between 0 and 100.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return (
    <Row className="d-flex justify-content-center">
      <div className="col-md-12 border mt-5 p-5">
        <h3 className="text-center">Nominee Information</h3>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="nomineeName">
              <Form.Label>Nominee's Name <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="nomineeName"
                value={formData.nomineeName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="relationshipWithAccountHolder">
              <Form.Label>Relationship with A/C Holder(s) <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                as="select"
                required
                name="relationshipWithAccountHolder"
                value={formData.relationshipWithAccountHolder}
                onChange={handleChange}
              >
                <option>Spouse/Child</option>
                <option>Parent</option>
                <option>Sibling</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="nomineeDob">
              <Form.Label>Date of Birth <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                required
                type="date"
                name="nomineeDob"
                value={formData.nomineeDob}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="nomineePercentage">
              <Form.Label>Percentage <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                required
                type="number"
                name="nomineePercentage"
                value={formData.nomineePercentage}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="nomineeNationalId">
              <Form.Label>National ID Number <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="nomineeNationalId"
                value={formData.nomineeNationalId}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="nomineeIdType">
              <Form.Label>National ID Type <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                as="select"
                required
                name="nomineeIdType"
                value={formData.nomineeIdType}
                onChange={handleChange}
              >
                <option value="NID">NID</option>
                <option value="Passport">Passport</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Others">Others</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        {formData.nomineeIdType === "Others" && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nomineeOtherIdType">
                <Form.Label>Other ID Type</Form.Label>
                <Form.Control
                  type="text"
                  name="nomineeOtherIdType"
                  value={formData.nomineeOtherIdType}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nomineeOtherIdDescription">
                <Form.Label>Other ID Description</Form.Label>
                <Form.Control
                  type="text"
                  name="nomineeOtherIdDescription"
                  value={formData.nomineeOtherIdDescription}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="nomineeAddress">
              <Form.Label>Present Address <span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                required
                type="text"
                name="nomineeAddress"
                value={formData.nomineeAddress}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Check
              type="checkbox"
              name="isNomineeUnder18"
              label="Yes, nominee is below 18 years old"
              checked={formData.isNomineeUnder18}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </div>
    </Row>
  );
}
