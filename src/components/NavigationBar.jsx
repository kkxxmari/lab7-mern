// Bootstrap provides the menu layout while React Router handles its links.
// We keep those two jobs together in this one shared navigation component.
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation } from 'react-router-dom';

function NavigationBar() {
  // Let the little menu button and the links share one open/closed state.
  // That way choosing a page can tuck the mobile menu away again.
  const [expanded, setExpanded] = useState(false);
  // Read the current route so the selected link also follows Back and Forward.
  // useLocation also changes when the browser goes Back or Forward.
  // This keeps the highlighted menu item in step with the current page.
  const location = useLocation();

  return (
    // collapseOnSelect tucks the links away after a mobile menu choice.
    <Navbar bg="dark" data-bs-theme="dark" expand="md" collapseOnSelect
      expanded={expanded} onToggle={setExpanded}>
      <Container>
        {/* The brand is a router link too, so it returns Home without a reload. */}
        <Navbar.Brand as={NavLink} to="/">React Lab 7</Navbar.Brand>
        {/* aria-controls points to the collapsible section below. */}
        <Navbar.Toggle aria-controls="page-menu" aria-expanded={expanded} />
        {/* This ID matches aria-controls on the toggle just above it.
            expanded supplies the same state to the button and the menu. */}
        <Navbar.Collapse id="page-menu">
          <Nav className="ms-auto" activeKey={location.pathname}>
            {/* The end option prevents Home from matching every route. */}
            <Nav.Link as={NavLink} to="/" end eventKey="/">Home</Nav.Link>
            {/* eventKey matches the pathname used by activeKey. */}
            <Nav.Link as={NavLink} to="/read" eventKey="/read">Read</Nav.Link>
            {/* The Create route opens the form for a new database record. */}
            <Nav.Link as={NavLink} to="/create" eventKey="/create">Create</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
import { useState } from 'react';
