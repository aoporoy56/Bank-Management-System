import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import District from '../Data/Districts.json';
import Division from '../Data/Divisions.json';

const AccountInformation = ({ onAccountInformationSubmit }) => {
  const [formData, setFormData] = useState({
    accountTitleEnglish: '',
    accountTitleBangla: '',
    accountType: 'savings',
    currency: 'BDT',
    selectedDivision: '',
    selectedDistrict: '',
    contactAddress: '',
    sourceOfFund: []
  });

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onAccountInformationSubmit(field, value);  // Call with the updated data
  };

  const handleSourceOfFundChange = (e) => {
    const value = e.target.value;
    const newSourceOfFund = formData.sourceOfFund.includes(value)
      ? formData.sourceOfFund.filter((item) => item !== value)
      : [...formData.sourceOfFund, value];
    const updatedData = { ...formData, sourceOfFund: newSourceOfFund };
    setFormData(updatedData);
    console.log(updatedData)
    onAccountInformationSubmit("sourceOfFund", newSourceOfFund);  // Update source of fund
  };

  // Filter districts based on the selected division
  const filteredDistricts = District.filter(
    (district) => district.division_id === formData.selectedDivision
  );

  return (
    <Row className="d-flex justify-content-center">
      <div className="col-md-12 border mt-5 p-5">
        <h3 className="text-center">Account Information</h3>

        {/* Account Title */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="accountTitleEnglish">
              <Form.Label>Account Title (in English)<span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.accountTitleEnglish}
                onChange={(e) => handleInputChange('accountTitleEnglish', e.target.value)}
                placeholder="Enter Account Title in English"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="accountTitleBangla">
              <Form.Label>Account Title (in Bangla)<span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.accountTitleBangla}
                onChange={(e) => handleInputChange('accountTitleBangla', e.target.value)}
                placeholder="Enter Account Title in Bangla"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Account Type and Currency */}
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="typeOfAccount">
              <Form.Label>Type of Account<span className="required-asterisk">*</span></Form.Label>
              <Form.Select
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                aria-label="Type of Account"
              >
                <option value="savingsAccounts">Savings Accounts</option>
                <option value="currentAccounts">Current Accounts</option>
                <option value="fixedAndRecurringDepositAccounts">Fixed and Recurring Deposit Accounts</option>
                <option value="specializedAccounts">Specialized Accounts</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group controlId="currency">
              <Form.Label>Currency<span className="required-asterisk">*</span></Form.Label>
              <Form.Select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                aria-label="Currency"
              >
                <option value="BDT">BDT</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Division Selection */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="division">
              <Form.Label>Division<span className="required-asterisk">*</span></Form.Label>
              <Form.Select
                required
                value={formData.selectedDivision}
                onChange={(e) => handleInputChange('selectedDivision', e.target.value)}
              >
                <option value="">--SELECT DIVISION--</option>
                {Division.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* District Selection */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="district">
              <Form.Label>District<span className="required-asterisk">*</span></Form.Label>
              <Form.Select
                required
                value={formData.selectedDistrict}
                onChange={(e) => handleInputChange('selectedDistrict', e.target.value)}
                disabled={!formData.selectedDivision}
              >
                <option value="">--SELECT DISTRICT--</option>
                {filteredDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Contact Address */}
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="contactAddress">
              <Form.Label>Contact Address<span className="required-asterisk">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}  // Adjust the number of rows as needed
                placeholder="Enter your contact address"
                required
                value={formData.contactAddress}
                onChange={(e) => handleInputChange('contactAddress', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Source of Fund */}
        <Row>
          <Col md={12} className="mb-3">
            <Form.Label>Source of Fund<span className="required-asterisk">*</span></Form.Label>
            <div>
              {[
                "Salary", "Gift", "Inheritance", "Professional Income", 
                "Business Income", "Rental Income", "Remittance", 
                "Encashment of Savings Deposit or Certificate"
              ].map((fundSource) => (
                <Form.Check
                required
                  key={fundSource}
                  type="checkbox"
                  label={fundSource}
                  value={fundSource}
                  checked={formData.sourceOfFund.includes(fundSource)}
                  onChange={handleSourceOfFundChange}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </Row>
  );
};

export default AccountInformation;
