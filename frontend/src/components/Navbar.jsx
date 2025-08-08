import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Project - VMS</Link>
      </div>

      <ul className="navbar-nav">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={location.pathname === "/streams" ? "active" : ""}>
          <Link to="/streams">Streams</Link>
        </li>
        <li className={location.pathname === "/alerts" ? "active" : ""}>
          <Link to="/alerts">Alerts</Link>
        </li>
        {/* <li className={location.pathname === '/test' ? 'active' : ''}>
          <Link to="/test">API Tester</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
