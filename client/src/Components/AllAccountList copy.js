import React, { useEffect, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";

export default function AllAccountList() {
  const [accountList, setAccountList] = useState([]);
  const [account, setAccount] = useState(); // [{}
  const [show, setShow] = useState(false);

  
  const SERVER_LINK = process.env.REACT_APP_SERVER_URL;

  const handleShow = (account) => {
    setAccount(account);
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handleDelete = async () => {
    await fetch(`${SERVER_LINK}/admin/delete/${account.accountNo}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    setShow(false);
  };
  const handleActive = async () => {
    await fetch(`${SERVER_LINK}/admin/active/${account.accountNo}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    setShow(false);
  };
  const handleDeactive = async () => {
    await fetch(
      `${SERVER_LINK}/admin/inactive/${account.accountNo}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    setShow(false);
  };
  const getList = async () => {
    await fetch(`${SERVER_LINK}/admin/allAccountList`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setAccountList(data.data.accounts);
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  useEffect(() => {
    getList();
  }, [show]);
  return (
    <div>
      <div className="container border mt-5 p-5">
        <h2>Personal Details</h2>
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Account No</th>
              <th scope="col">Full Name</th>
              {/* <th scope="col">Image</th> */}
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {accountList.map((account, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{account.accountNo}</td>
                <td>{account.accountTitleEnglish}</td>
                {/* <td>{account.image}</td> */}
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
          <Modal.Title>Account Details: #{account.accountNo}</Modal.Title>
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
                <td>{account.selectedDivision}</td>
              </tr>
              <tr>
                <td><strong>District:</strong></td>
                <td>{account.selectedDistrict}</td>
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
      
              {/* Images */}
              <tr>
                <td><strong>Self Image:</strong></td>
                <td>
                  {account.selfImageUrl && (
                    <img src={account.selfImageUrl} alt="Self" style={{ maxWidth: '150px' }} />
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>NID Image:</strong></td>
                <td>
                  {account.nidImageUrl && (
                    <img src={account.nidImageUrl} alt="NID" style={{ maxWidth: '150px' }} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          {account.status === "active" ? (
            <Button variant="warning" onClick={handleDeactive}>
              Freeze
            </Button>
          ) : (
            <Button variant="success" onClick={handleActive}>
              Active
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      
      )}
    </div>
  );
}
