import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
  return (
    <Navbar  variant="dark" expand="lg" className="shadow-sm" style={{backgroundColor:"#e9ae23"}}>
      <Container>
        <Navbar.Brand href="/" className="fw-bold">
        <img src="/favicon.png" alt="logo" style={{height:"50px", marginRight: "10px" }}/>
        Eastern Bank PLC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link href="/customer" className="nav-link-custom">
              Customer
            </Nav.Link>
            <Nav.Link href="/track" className="nav-link-custom">
              Track Application
            </Nav.Link>
            <Nav.Link href="/customer/reset" className="nav-link-custom">
              Password Reset
            </Nav.Link>
            <Nav.Link href="/admin" className="nav-link-custom">
              Admin
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
