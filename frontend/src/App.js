import { Dropdown, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Routes, Route, Link, useNavigate } from "react-router-dom";

// Nav bar pages
import Home from "./home";
import About from "./about";
import Contact from "./contact";
import Settings from "./settings"
import Login from "./login";

// CSS file
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="light" expand="lg" className='navBar'>
        <Navbar.Brand style={{'marginLeft': '15px', 'fontSize': '35px'}} href="/" ><strong>Studying Sucks</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <Nav>
            <LinkContainer to="/">
              <Nav.Link className='nav-link'>
                <strong>Home</strong>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link className='nav-link'>
                <strong>About</strong>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact">
              <Nav.Link className='nav-link'>
                <strong>Contact</strong>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link className='nav-link'>
                <strong>Log In</strong>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Home navigate={navigate}/>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </>
  );
}

export default App;
