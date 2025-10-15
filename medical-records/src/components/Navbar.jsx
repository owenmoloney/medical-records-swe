import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="w-100 m-0 p-0 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/">Medical Records</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/data">Show Sample Patient Data</Nav.Link>
            <Nav.Link as={Link} to="/patients">Insert New Record Test</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
