import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../assets/Images/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  const [companionsOpen, setCompanionsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <img src={logo} alt="logo" className="logo" />
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><HashLink smooth to="/#home" onClick={closeMenu}>Home</HashLink></li>
        <li><HashLink smooth to="/#about" onClick={closeMenu}>About</HashLink></li>
        <li><Link to="/feedback" onClick={closeMenu}>Feedback</Link></li>

        <li
          className={`dropdown-parent ${companionsOpen ? "active" : "inactive"}`}
          onClick={() => setCompanionsOpen(!companionsOpen)}
        >
          <HashLink>
            Companions <i className="fa fa-angle-down"></i>
          </HashLink>
          <ul className="dropdown">
            <li><HashLink smooth to="/#Eagle" onClick={() => setIsOpen(false)}>Eagle</HashLink></li>
            <li><HashLink smooth to="/#Wolf" onClick={() => setIsOpen(false)}>Wolf</HashLink></li>
            <li><HashLink smooth to="/#Elephant" onClick={() => setIsOpen(false)}>Elephant</HashLink></li>
            <li><HashLink smooth to="/#Whale" onClick={() => setIsOpen(false)}>Whale</HashLink></li>
          </ul>
        </li>

      </ul>
      <div className={`burger ${isOpen ? "toggle" : ""}`} onClick={toggleMenu}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
      </div>
    </nav>
  );
}

export default Navbar;