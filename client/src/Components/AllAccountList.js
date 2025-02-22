import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Form } from "react-bootstrap";
import Districts from "../Data/Districts.json";
import Divisions from "../Data/Divisions.json";

export default function AllAccountList() {
  const [accountList, setAccountList] = useState([]);
  const [filteredAccountList, setFilteredAccountList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [account, setAccount] = useState(); // Current account details
  const [show, setShow] = useState(false);
  const [imageModal, setImageModal] = useState(false); // For image fullscreen view
  const [selectedImage, setSelectedImage] = useState(""); // URL of the selected image

  const SERVER_LINK = process.env.REACT_APP_SERVER_URL;

  const handleShow = (account) => {
    setAccount(account);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModal(true);
  };

  const handleImageClose = () => {
    setSelectedImage("");
    setImageModal(false);
  };

  const handleDelete = async () => {
    await fetch(`${SERVER_LINK}/admin/delete/${account.accountNo}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    setShow(false);
  };

  const handleActive = async () => {
    await fetch(`${SERVER_LINK}/admin/active/${account.accountNo}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    setShow(false);
  };

  const handleDeactive = async () => {
    await fetch(`${SERVER_LINK}/admin/inactive/${account.accountNo}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    setShow(false);
  };

  const getList = async () => {
    await fetch(`${SERVER_LINK}/admin/allAccountList`)
      .then((res) => res.json())
      .then((data) => {
        setAccountList(data.data.accounts);
        setFilteredAccountList(data.data.accounts); // Initialize filtered list
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Filter account list based on search term
    const filtered = accountList.filter((account) =>
      account.accountTitleEnglish.toLowerCase().includes(value.toLowerCase()) ||
      account._id.toLowerCase().includes(value.toLowerCase()) // Include account number in search
    );
    setFilteredAccountList(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    getList();
  }, [show]);

  return (
    <div>
      <div className="container border mt-5 p-5">
        <h2 className="text-center mb-4">Application List</h2>

        {/* Search Field */}
        <Form.Group className="mb-3" controlId="searchField">
          <Form.Control
            type="text"
            placeholder="Search by Account Title or Application No"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>

        {/* Account List Table */}
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Application No</th>
              <th scope="col">Full Name</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccountList.map((account, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{account.accountNo}</td>
                <td>{account.accountTitleEnglish}</td>
                <td>
                  {account.status === "active" && <Badge bg="success">Active</Badge>}
                  {account.status === "inactive" && <Badge bg="danger">Inactive</Badge>}
                  {account.status === "pending" && <Badge bg="warning">Pending</Badge>}
                </td>
                <td>
                  <Button variant="primary" onClick={() => handleShow(account)}>
                    Launch
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {account && (
        <Modal show={show} onHide={handleClose} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>#{account._id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-bordered">
              <tbody>
                {/* Account Information */}
                <tr>
                  <td><strong>Account Title (English):</strong></td>
                  <td>{account.accountTitleEnglish}</td>
                </tr>
                <tr>
                  <td><strong>Account Title (Bangla):</strong></td>
                  <td>{account.accountTitleBangla}</td>
                </tr>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>{account.accountType}</td>
                </tr>
                <tr>
                  <td><strong>Currency:</strong></td>
                  <td>{account.currency}</td>
                </tr>
                <tr>
                  <td><strong>Division:</strong></td>
                  <td>{Divisions.find(
                    (division) => division.id === account.selectedDivision
                  )?.name}</td>
                </tr>
                <tr>
                  <td><strong>District:</strong></td>
                  <td>{Districts.find(
                    (district) => district.id === account.selectedDistrict
                  )?.name}</td>
                </tr>
                <tr>
                  <td><strong>Contact Address:</strong></td>
                  <td>{account.contactAddress}</td>
                </tr>
                <tr>
                  <td><strong>Source of Fund:</strong></td>
                  <td>{account.sourceOfFund.join(', ')}</td>
                </tr>

                {/* Customer Information */}
                <tr>
                  <td><strong>First Name:</strong></td>
                  <td>{account.firstName}</td>
                </tr>
                <tr>
                  <td><strong>Last Name:</strong></td>
                  <td>{account.lastName}</td>
                </tr>
                <tr>
                  <td><strong>Father's Name:</strong></td>
                  <td>{account.fatherName}</td>
                </tr>
                <tr>
                  <td><strong>Mother's Name:</strong></td>
                  <td>{account.motherName}</td>
                </tr>
                <tr>
                  <td><strong>Spouse Name:</strong></td>
                  <td>{account.spouseName}</td>
                </tr>
                <tr>
                  <td><strong>Gender:</strong></td>
                  <td>{account.gender}</td>
                </tr>
                <tr>
                  <td><strong>Date of Birth:</strong></td>
                  <td>{formatDate(account.dob)}</td>
                </tr>
                <tr>
                  <td><strong>Occupation:</strong></td>
                  <td>{account.occupation}</td>
                </tr>
                <tr>
                  <td><strong>Monthly Income:</strong></td>
                  <td>{account.monthlyIncome}</td>
                </tr>
                <tr>
                  <td><strong>National ID:</strong></td>
                  <td>{account.nationalId}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{account.email}</td>
                </tr>
                <tr>
                  <td><strong>Phone 1:</strong></td>
                  <td>{account.phone1}</td>
                </tr>
                <tr>
                  <td><strong>Phone 2:</strong></td>
                  <td>{account.phone2}</td>
                </tr>
                <tr>
                  <td><strong>Present Address:</strong></td>
                  <td>{account.presentAddress}</td>
                </tr>
                <tr>
                  <td><strong>Permanent Address:</strong></td>
                  <td>{account.permanentAddress}</td>
                </tr>
                <tr>
                  <td><strong>Religion:</strong></td>
                  <td>{account.religion}</td>
                </tr>
                <tr>
                  <td><strong>Marital Status:</strong></td>
                  <td>{account.maritalStatus}</td>
                </tr>

                {/* Nominee Information */}
                <tr>
                  <td><strong>Nominee Name:</strong></td>
                  <td>{account.nomineeName}</td>
                </tr>
                <tr>
                  <td><strong>Relationship with Account Holder:</strong></td>
                  <td>{account.relationshipWithAccountHolder}</td>
                </tr>
                <tr>
                  <td><strong>Nominee Date of Birth:</strong></td>
                  <td>{formatDate(account.nomineeDob)}</td>
                </tr>
                <tr>
                  <td><strong>Nominee Percentage:</strong></td>
                  <td>{account.nomineePercentage}</td>
                </tr>
                <tr>
                  <td><strong>Nominee National ID:</strong></td>
                  <td>{account.nomineeNationalId}</td>
                </tr>
                <tr>
                  <td><strong>Nominee Address:</strong></td>
                  <td>{account.nomineeAddress}</td>
                </tr>

                {/* Other account details */}
                <tr>
                  <td><strong>Self Image:</strong></td>
                  <td>
                    {account.selfImageUrl && (
                      <img
                        src={account.selfImageUrl}
                        alt="Self"
                        style={{ maxWidth: "150px", cursor: "pointer" }}
                        onClick={() => handleImageClick(account.selfImageUrl)}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td><strong>NID Image:</strong></td>
                  <td>
                    {account.nidImageUrl && (
                      <img
                        src={account.nidImageUrl}
                        alt="NID"
                        style={{ maxWidth: "150px", cursor: "pointer" }}
                        onClick={() => handleImageClick(account.nidImageUrl)}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td><strong>Signature Image:</strong></td>
                  <td>
                    {account.signatureImageUrl && (
                      <img
                        src={account.signatureImageUrl}
                        alt="NID"
                        style={{ maxWidth: "150px", cursor: "pointer" }}
                        onClick={() => handleImageClick(account.signatureImageUrl)}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
            {account.status === "active" ? (
              <Button variant="warning" onClick={handleDeactive}>Freeze</Button>
            ) : (
              <Button variant="success" onClick={handleActive}>Active</Button>
            )}
          </Modal.Footer>
        </Modal>
      )}

      {/* Fullscreen Image Modal */}
      <Modal show={imageModal} onHide={handleImageClose} centered>
        <Modal.Body>
          <img
            src={selectedImage}
            alt="Fullscreen"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
