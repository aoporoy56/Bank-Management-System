import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Division from "../Data/Divisions.json";
import Districts from "../Data/Districts.json";
import CustomerInforomation from "../Components/CustomerInformation";

export default function CustomerRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [banglaFullTitle, setBanglaFullTitle] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [nationality, setNationality] = useState("BANGLADESHI");
  const [religion, setReligion] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [residentStatus, setResidentStatus] = useState("");
  const [dob, setDob] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [professionalAddress, setProfessionalAddress] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [validated, setValidated] = useState(false);
  const [sourceOfFund, setSourceOfFund] = useState([]);
  const [accountType, setAccountType] = useState("savings");
  const [currency, setCurrency] = useState("BDT");
  const [accountTitleEnglish, setAccountTitleEnglish] = useState("");
  const [accountTitleBangla, setAccountTitleBangla] = useState("");



  // Nominee Information States
  const [nomineeName, setNomineeName] = useState("");
  const [relationshipWithAccountHolder, setRelationshipWithAccountHolder] = useState("Spouse/Child");
  const [nomineeDob, setNomineeDob] = useState("");
  const [nomineePercentage, setNomineePercentage] = useState(100);
  const [nomineeNationalId, setNomineeNationalId] = useState("");
  const [nomineeIdType, setNomineeIdType] = useState("NID");
  const [nomineeOtherIdType, setNomineeOtherIdType] = useState("");
  const [nomineeOtherIdDescription, setNomineeOtherIdDescription] = useState("");
  const [nomineeAddress, setNomineeAddress] = useState("");
  const [isNomineeUnder18, setIsNomineeUnder18] = useState(false);

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  useEffect(() => {
    if (selectedDivision) {
      const filtered = Districts.filter((district) => district.division_id === selectedDivision);
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [selectedDivision]);

  const handleSourceOfFundChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSourceOfFund((prevState) => [...prevState, value]);
    } else {
      setSourceOfFund((prevState) => prevState.filter((item) => item !== value));
    }
  };

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleEnglishChange = (e) => {
    setAccountTitleEnglish(e.target.value);
  };

  const handleBanglaChange = (e) => {
    setAccountTitleBangla(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.currentTarget.checkValidity());
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const data = {
      firstName,
      lastName,
      banglaFullTitle,
      fatherName,
      motherName,
      spouseName,
      nationality,
      religion,
      maritalStatus,
      residentStatus,
      dob,
      placeOfBirth,
      countryOfBirth,
      gender,
      occupation,
      monthlyIncome,
      nationalId,
      phone1,
      phone2,
      email,
      presentAddress,
      permanentAddress,
      professionalAddress,
      contactAddress,
      selectedDivision,
      selectedDistrict,

      // Nominee Information
      nomineeName,
      relationshipWithAccountHolder,
      nomineeDob,
      nomineePercentage,
      nomineeNationalId,
      nomineeIdType,
      nomineeOtherIdType,
      nomineeOtherIdDescription,
      nomineeAddress,
      isNomineeUnder18,
    };


    console.log(data)
    try {
      const response = await fetch("http://localhost:4000/customer/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.status === 200) {
        alert(result.message);
        window.location.href = "/customer/login";
      } else {
        alert("Account creation failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <Row className="d-flex justify-content-center">
        <div className="col-md-12 border mt-5 p-5">
          <h2 className="text-center" style={{ color: "#0d47a1" }}>
            Customer Sign Up
          </h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">

            <CustomerInforomation />

            <Row className="d-flex justify-content-center">
              <div className="col-md-12 border mt-5 p-5">
                <h3 className="text-center">Account Information</h3>

                {/* Account Title */}
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="accountTitleEnglish">
                      <Form.Label>Account Title (in English)*</Form.Label>
                      <Form.Control
                        type="text"
                        value={accountTitleEnglish}
                        onChange={(e) => setAccountTitleEnglish(e.target.value)}
                        placeholder="Enter Account Title in English"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="accountTitleBangla">
                      <Form.Label>Account Title (in Bangla)*</Form.Label>
                      <Form.Control
                        type="text"
                        value={accountTitleBangla}
                        onChange={(e) => setAccountTitleBangla(e.target.value)}
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
                      <Form.Label>Type of Account*</Form.Label>
                      <Form.Select
                        value={accountType}
                        onChange={handleAccountTypeChange}
                        aria-label="Type of Account"
                      >
                        <option value="savings">Savings</option>
                        <option value="checking">Checking</option>
                        <option value="business">Business</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="currency">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        value={currency}
                        onChange={handleCurrencyChange}
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
                      <Form.Label>Division</Form.Label>
                      <Form.Select
                        required
                        value={selectedDivision}
                        onChange={(e) => setSelectedDivision(e.target.value)}
                      >
                        <option value="">--SELECT DIVISION--</option>
                        {Division.map((div) => (
                          <option key={div.id} value={div.id}>
                            {div.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">Please select a division.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* District Selection */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="district">
                      <Form.Label>District</Form.Label>
                      <Form.Select
                        required
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedDivision}
                      >
                        <option value="">--SELECT DISTRICT--</option>
                        {filteredDistricts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">Please select a district.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Contact Address */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="contactAddress">
                      <Form.Label>Contact Address*</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}  // Adjust the number of rows as needed
                        placeholder="Enter your contact address"
                        required
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        isInvalid={validated && !contactAddress}  // Validate if needed
                      />
                      <Form.Control.Feedback type="invalid">Contact address is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Source of Fund */}
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label>Source of Fund*</Form.Label>
                    <div>
                      <Form.Check
                        type="checkbox"
                        label="Salary"
                        value="Salary"
                        checked={sourceOfFund.includes("Salary")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Gift"
                        value="Gift"
                        checked={sourceOfFund.includes("Gift")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Inheritance"
                        value="Inheritance"
                        checked={sourceOfFund.includes("Inheritance")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Professional Income"
                        value="Professional Income"
                        checked={sourceOfFund.includes("Professional Income")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Business Income"
                        value="Business Income"
                        checked={sourceOfFund.includes("Business Income")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Rental Income"
                        value="Rental Income"
                        checked={sourceOfFund.includes("Rental Income")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Remittance"
                        value="Remittance"
                        checked={sourceOfFund.includes("Remittance")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Encashment of Savings Deposit or Certificate"
                        value="Encashment of Savings Deposit or Certificate"
                        checked={sourceOfFund.includes("Encashment of Savings Deposit or Certificate")}
                        onChange={(e) => handleSourceOfFundChange(e)}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Row>


            {/* CustomerInformation */}
            <Row className="d-flex justify-content-center">
              <div className="col-md-12 border mt-5 p-5">
                <h3 className="text-center">Customer Information</h3>
                {/* First Name and Last Name */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="validationCustom02">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Customer Name in Bangla and Father's Name */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="validationCustomBanglaTitle">
                      <Form.Label>Customer Name (in Bangla)</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Customer Name (in Bangla)"
                        value={banglaFullTitle}
                        onChange={(e) => setBanglaFullTitle(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">Bangla full title is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="fatherName">
                      <Form.Label>Father's Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Father's Name"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">Father's name is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Mother’s Name and Spouse’s Name */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="motherName">
                      <Form.Label>Mother's Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Mother's Name"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
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
                        value={spouseName}
                        onChange={(e) => setSpouseName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Gender and Date of Birth */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
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
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">Date of birth is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Occupation and Monthly Income */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="occupation">
                      <Form.Label>Occupation</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        isInvalid={validated && !occupation}
                      />
                      <Form.Control.Feedback type="invalid">Occupation is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="monthlyIncome">
                      <Form.Label>Monthly Income</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        placeholder="Monthly Income"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        isInvalid={validated && !monthlyIncome}
                      />
                      <Form.Control.Feedback type="invalid">Monthly income is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* National ID and Email */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nationalId">
                      <Form.Label>National ID</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="National ID"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        isInvalid={validated && !nationalId}
                      />
                      <Form.Control.Feedback type="invalid">National ID is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={validated && !email}
                      />
                      <Form.Control.Feedback type="invalid">Email is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Phone Numbers */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone1">
                      <Form.Label>Phone Number 1</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Phone Number 1"
                        value={phone1}
                        onChange={(e) => setPhone1(e.target.value)}
                        isInvalid={validated && !phone1}
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
                        value={phone2}
                        onChange={(e) => setPhone2(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Addresses */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="presentAddress">
                      <Form.Label>Present Address</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Present Address"
                        value={presentAddress}
                        onChange={(e) => setPresentAddress(e.target.value)}
                        isInvalid={validated && !presentAddress}
                      />
                      <Form.Control.Feedback type="invalid">Present address is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="permanentAddress">
                      <Form.Label>Permanent Address</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Permanent Address"
                        value={permanentAddress}
                        onChange={(e) => setPermanentAddress(e.target.value)}
                        isInvalid={validated && !permanentAddress}
                      />
                      <Form.Control.Feedback type="invalid">Permanent address is required.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Row>

            <Row className="d-flex justify-content-center">
              <div className="col-md-12 border mt-5 p-5">
                <h3 className="text-center">Nominee Information</h3>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nomineeName">
                      <Form.Label>Nominee's Name*</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="relationshipWithAccountHolder">
                      <Form.Label>Relationship with A/C Holder(s)*</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        value={relationshipWithAccountHolder}
                        onChange={(e) => setRelationshipWithAccountHolder(e.target.value)}
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
                      <Form.Label>Date of Birth*</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        value={nomineeDob}
                        onChange={(e) => setNomineeDob(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nomineePercentage">
                      <Form.Label>Percentage*</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        value={nomineePercentage}
                        onChange={(e) => setNomineePercentage(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nomineeNationalId">
                      <Form.Label>National ID Number*</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={nomineeNationalId}
                        onChange={(e) => setNomineeNationalId(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nomineeIdType">
                      <Form.Label>National ID Type*</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        value={nomineeIdType}
                        onChange={(e) => setNomineeIdType(e.target.value)}
                      >
                        <option value="NID">NID</option>
                        <option value="Passport">Passport</option>
                        <option value="Birth Certificate">Birth Certificate</option>
                        <option value="Others">Others</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                {nomineeIdType === "Others" && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="nomineeOtherIdType">
                        <Form.Label>Other ID Type</Form.Label>
                        <Form.Control
                          type="text"
                          value={nomineeOtherIdType}
                          onChange={(e) => setNomineeOtherIdType(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="nomineeOtherIdDescription">
                        <Form.Label>Other ID Description</Form.Label>
                        <Form.Control
                          type="text"
                          value={nomineeOtherIdDescription}
                          onChange={(e) => setNomineeOtherIdDescription(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="nomineeAddress">
                      <Form.Label>Present Address*</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={nomineeAddress}
                        onChange={(e) => setNomineeAddress(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Check
                      type="checkbox"
                      label="Yes, nominee is below 18 years old"
                      checked={isNomineeUnder18}
                      onChange={(e) => setIsNomineeUnder18(e.target.checked)}
                    />
                  </Col>
                </Row>

              </div>
            </Row>

            {/* Submit Button */}
            <Button type="submit" className="w-100 btn btn-primary btn-lg shadow-sm mt-5">
              Sign Up
            </Button>

            <p className="mt-3 text-center">
              Already have an account? <Link to="/customer/login" className="text-primary">Login</Link>
            </p>
          </Form>
        </div>
      </Row>
    </div>
  );
}
