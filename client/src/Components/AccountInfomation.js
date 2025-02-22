import React, { useState } from 'react';
import { Row, Col, Form, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import District from '../Data/Districts.json';
import Division from '../Data/Divisions.json';

const AccountInformation = ({ onAccountInformationSubmit, validated }) => {
  const [formData, setFormData] = useState({
    accountTitleEnglish: '',
    accountTitleBangla: '',
    accountType: 'savingsAccounts',
    currency: 'BDT',
    selectedDivision: '',
    selectedDistrict: '',
    contactAddress: '',
    sourceOfFund: [],
    selfImage: null,
    nidImage: null,
    signatureImage: null, // New field for signature image
    selfImagePreview: null,
    nidImagePreview: null,
    signatureImagePreview: null, // Preview for the signature image
    selfImageUrl: '',
    nidImageUrl: '',
    signatureImageUrl: '', // Cloudinary URL for the signature image
  });

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onAccountInformationSubmit(field, value);
  };

  const handleFileChange = async (field, file) => {
    const updatedData = { ...formData, [field]: file };

    if (file) {
      const previewField = `${field}Preview`;
      updatedData[previewField] = URL.createObjectURL(file); // Create a preview URL

      // Create a FormData object to upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'dfreqrdsy'); // Replace with your Cloudinary unsigned preset
      formData.append('cloud_name', 'dfreqrdsy'); // Replace with your Cloudinary cloud name

      try {
        // Send the image to Cloudinary
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dfreqrdsy/image/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        // Store the Cloudinary URL
        updatedData[`${field}Url`] = response.data.secure_url;
        onAccountInformationSubmit(`${field}Url`, response.data.secure_url);
        console.log(response.data.secure_url); // You can log or use the URL as needed
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
      }
    }

    setFormData(updatedData);
  };

  const handleImageDelete = (field) => {
    const updatedData = { ...formData };
    updatedData[field] = null;
    updatedData[`${field}Preview`] = null; // Clear the preview as well
    updatedData[`${field}Url`] = ''; // Clear the Cloudinary URL

    setFormData(updatedData);
    onAccountInformationSubmit(field, null); // Pass null to the parent if needed
  };

  const handleSourceOfFundChange = (e) => {
    const value = e.target.value;
    const newSourceOfFund = formData.sourceOfFund.includes(value)
      ? formData.sourceOfFund.filter((item) => item !== value)
      : [...formData.sourceOfFund, value];
    const updatedData = { ...formData, sourceOfFund: newSourceOfFund };
    setFormData(updatedData);
    console.log(updatedData);
    onAccountInformationSubmit('sourceOfFund', newSourceOfFund);
  };

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

        {/* Division and District Selection */}
        <Row>
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
                  key={fundSource}
                  type="checkbox"
                  label={fundSource}
                  value={fundSource}
                  checked={formData.sourceOfFund.includes(fundSource)}
                  onChange={handleSourceOfFundChange}
                />
              ))}
            </div>
            {/* Conditional error message */}
            {validated && formData.sourceOfFund.length === 0 && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                Please select at least one source of fund.
              </div>
            )}
          </Col>
        </Row>

        {/* Self Image */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="selfImage" className="mb-3">
              <Form.Label>
                Self Image<span className="required-asterisk">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange('selfImage', e.target.files[0])
                }
                required
              />
              {formData.selfImagePreview && (
                <div className="mt-2 position-relative">
                  <Image
                    src={formData.selfImagePreview}
                    alt="Self Image Preview"
                    thumbnail
                    width={100}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ zIndex: 1 }}
                    onClick={() => handleImageDelete('selfImage')}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                </div>
              )}
            </Form.Group>
          </Col>

          {/* NID Image */}
          <Col md={6}>
            <Form.Group controlId="nidImage" className="mb-3">
              <Form.Label>
                NID Image<span className="required-asterisk">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange('nidImage', e.target.files[0])
                }
                required
              />
              {formData.nidImagePreview && (
                <div className="mt-2 position-relative">
                  <Image
                    src={formData.nidImagePreview}
                    alt="NID Image Preview"
                    thumbnail
                    width={100}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ zIndex: 1 }}
                    onClick={() => handleImageDelete('nidImage')}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Signature Image */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="signatureImage" className="mb-3">
              <Form.Label>
                Signature Image<span className="required-asterisk">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange('signatureImage', e.target.files[0])
                }
                required
              />
              {formData.signatureImagePreview && (
                <div className="mt-2 position-relative">
                  <Image
                    src={formData.signatureImagePreview}
                    alt="Signature Image Preview"
                    thumbnail
                    width={100}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ zIndex: 1 }}
                    onClick={() => handleImageDelete('signatureImage')}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
      </div>
    </Row>
  );
};

export default AccountInformation;