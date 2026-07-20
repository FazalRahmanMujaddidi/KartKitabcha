import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <NavLink className="navbar-brand" to="/">
          KartKitabch
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/companies">
                Companies
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Locations
              </a>

              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/provinces">
                    Province
                  </NavLink>
                </li>

                <li>
                  <NavLink className="dropdown-item" to="/company-location">
                    Company Root
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vehicle">
                Vehicle
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/report">
                Report
              </NavLink>
            </li>
<li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle"
    href="#"
    id="letterDropdown"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Letter
  </a>

  <ul className="dropdown-menu" aria-labelledby="letterDropdown">
    <li>
      <NavLink className="dropdown-item" to="/letter">
        Letter
      </NavLink>
    </li>

    <li>
      <NavLink className="dropdown-item" to="/maktob">
        Maktob
      </NavLink>
    </li>
  </ul>
</li>
          </ul>
        </div>

      </div>
    </nav>
  );
}