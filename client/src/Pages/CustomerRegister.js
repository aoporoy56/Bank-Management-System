import React, { useState } from "react";
import { Form, Button, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CustomerInformation from "../Components/CustomerInformation";
import AccountInformation from "../Components/AccountInfomation";
import NomineeInformation from "../Components/NomineeInformation";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

export default function CustomerRegister() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Account Information
    accountTitleEnglish: "",
    accountTitleBangla: "",
    accountType: "savingsAccounts",
    currency: "BDT",
    selectedDivision: "",
    selectedDistrict: "",
    contactAddress: "",
    sourceOfFund: [],
    selfImageUrl: "",
    nidImageUrl: "",
    signatureImageUrl: "",

    // Customer Information
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
    religion: "",
    maritalStatus: "",

    // Nominee Information
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;

    if (form.checkValidity() === false || formData.sourceOfFund.length === 0) {
      event.stopPropagation();
      setValidated(true);
      setLoading(false);
      console.log("Form is invalid");
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/customer/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.status === 201) {
          toast.success(result.message);
          generatePDF(formData); // Generate and download the PDF
          navigate("/track");
        } else if (response.status === 400) {
          toast.error(result.message);
        } else if (response.status === 500) {
          toast.error("Something went wrong with the server. Please try again later.");
        } else {
          alert(result.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("Customer Registration Details", 10, 10);

    // Account Information
    doc.text("Account Information:", 10, 20);
    doc.text(`Title (English): ${data.accountTitleEnglish}`, 10, 30);
    doc.text(`Title (Bangla): ${data.accountTitleBangla}`, 10, 40);
    doc.text(`Account Type: ${data.accountType}`, 10, 50);
    doc.text(`Currency: ${data.currency}`, 10, 60);

    // Customer Information
    doc.text("Customer Information:", 10, 70);
    doc.text(`Name: ${data.firstName} ${data.lastName}`, 10, 80);
    doc.text(`Father's Name: ${data.fatherName}`, 10, 90);
    doc.text(`Mother's Name: ${data.motherName}`, 10, 100);
    doc.text(`Email: ${data.email}`, 10, 110);
    doc.text(`Phone: ${data.phone1}`, 10, 120);

    // Nominee Information
    doc.text("Nominee Information:", 10, 130);
    doc.text(`Nominee Name: ${data.nomineeName}`, 10, 140);
    doc.text(`Relationship: ${data.relationshipWithAccountHolder}`, 10, 150);
    doc.text(`Nominee Address: ${data.nomineeAddress}`, 10, 160);

    doc.save("Customer_Registration_Details.pdf");
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className="container ">
      <Row className="d-flex justify-content-center">
        <div className="col-md-12 mt-5 p-5 inner-body">
          <h2 className="text-center" style={{ color: "#0d47a1" }}>
            Customer Sign Up
          </h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
            <AccountInformation onAccountInformationSubmit={handleFormDataChange} validated={validated} />
            <CustomerInformation onCustomerInformationSubmit={handleFormDataChange} validated={validated} />
            <NomineeInformation onNomineeInformationSubmit={handleFormDataChange} validated={validated} />

            <Button type="submit" className="w-100 btn btn-primary btn-lg shadow-sm mt-5" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <p className="mt-3 text-center">
              Already have an account?{" "}
              <Link to="/customer/login" className="text-primary">
                Login
              </Link>
            </p>
          </Form>
        </div>
      </Row>
    </div>
  );
}
