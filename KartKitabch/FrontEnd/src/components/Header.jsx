
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const COLORS = {
    dark: "#343148",
    light: "#cdc6bd",
    brown: "#583432",
  };

  const { user, loading, logout } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  // ---------------------------------
  // Get roles safely
  // ---------------------------------
  const roles = Array.isArray(user.roles)
    ? user.roles
    : user.role
      ? [user.role]
      : [];

  const isOwner = roles.includes("Owner");
  const isSimpleUser = roles.includes("SimpleUser");
  const isCompanyUser = roles.includes("CompanyUser");

  // Owner + SimpleUser
  const canSeeMainMenu = isOwner || isSimpleUser;

  // Only Owner
  const canSeeUsers = isOwner;

  const navLinkStyle = {
    color: COLORS.light,
    textAlign: "right",
    direction: "rtl",
    whiteSpace: "nowrap",
  };

  const dropdownStyle = {
    backgroundColor: COLORS.light,
    textAlign: "right",
    direction: "rtl",
    minWidth: "180px",
  };

  const dropdownItemStyle = {
    color: COLORS.dark,
    textAlign: "right",
    direction: "rtl",
    fontSize: "14px",
  };

  const brandStyle = {
    color: COLORS.light,
    textAlign: "right",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const logoutButtonStyle = {
    backgroundColor: COLORS.brown,
    color: COLORS.light,
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const roleName = isOwner
    ? "مالک"
    : isSimpleUser
      ? "ساده کاروونکی"
      : isCompanyUser
        ? "د شرکت کاروونکی"
        : "";

  return (
    <nav
      className="navbar navbar-expand-lg"
      dir="rtl"
      style={{
        backgroundColor: COLORS.dark,
        color: COLORS.light,
      }}
    >
      <div className="container">

        {/* Logo */}
        <NavLink
          className="navbar-brand fw-bold"
          to="/"
          style={brandStyle}
        >
          کارت کتابچه
        </NavLink>

        {/* Mobile button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Menu"
          style={{
            backgroundColor: COLORS.brown,
            border: "none",
            padding: "5px 9px",
          }}
        >
          <span
            style={{
              color: COLORS.light,
              fontSize: "20px",
            }}
          >
            ☰
          </span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          {/* =====================================
              OWNER + SIMPLE USER
          ===================================== */}
          {canSeeMainMenu && (
            <ul className="navbar-nav me-auto">

              {/* کور */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                  style={navLinkStyle}
                >
                  کور
                </NavLink>
              </li>

              {/* ځایونه */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={navLinkStyle}
                >
                  ځایونه
                </a>

                <ul
                  className="dropdown-menu"
                  style={dropdownStyle}
                >
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/provinces"
                      style={dropdownItemStyle}
                    >
                      ولایت / ښار
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/company-location"
                      style={dropdownItemStyle}
                    >
                      د شرکت مسیرونه
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* شرکتونه */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={navLinkStyle}
                >
                  شرکتونه
                </a>

                <ul
                  className="dropdown-menu"
                  style={dropdownStyle}
                >
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/companies"
                      style={dropdownItemStyle}
                    >
                      شرکت
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/gpscompany"
                      style={dropdownItemStyle}
                    >
                      شرکت جی بي اس
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* وسایط */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/vehicle"
                  style={navLinkStyle}
                >
                  وسایط
                </NavLink>
              </li>

              {/* راپور */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/report"
                  style={navLinkStyle}
                >
                  راپور
                </NavLink>
              </li>

              {/* کاروونکی - ONLY OWNER */}
              {canSeeUsers && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/users"
                    style={navLinkStyle}
                  >
                    کاروونکی
                  </NavLink>
                </li>
              )}

              {/* مکتوب
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={navLinkStyle}
                >
                  مکتوب
                </a>

                <ul
                  className="dropdown-menu"
                  style={dropdownStyle}
                >
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/officecontent"
                      style={dropdownItemStyle}
                    >
                      دفتر
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/sender"
                      style={dropdownItemStyle}
                    >
                      لېږونکی
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/person"
                      style={dropdownItemStyle}
                    >
                      شخص
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/lettercontent"
                      style={dropdownItemStyle}
                    >
                      د مکتوب محتوا
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/letter"
                      style={dropdownItemStyle}
                    >
                      مکتوب
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/maktob"
                      style={dropdownItemStyle}
                    >
                      مکتوب
                    </NavLink>
                  </li>
                </ul>
              </li> */}

            </ul>
          )}

          {/* =====================================
              COMPANY USER
              ONLY HOME
          ===================================== */}
          {isCompanyUser && (
            <ul className="navbar-nav me-auto">

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                  style={navLinkStyle}
                >
                  کور
                </NavLink>
              </li>

            </ul>
          )}

          {/* =====================================
              USER + LOGOUT
          ===================================== */}
          <div
            className="d-flex align-items-center gap-2 mt-2 mt-lg-0"
            style={{
              direction: "rtl",
            }}
          >
            <span
              style={{
                color: COLORS.light,
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {user.fullName || user.userName}
            </span>

            {roleName && (
              <span
                style={{
                  color: COLORS.light,
                  fontSize: "11px",
                  opacity: 0.8,
                  whiteSpace: "nowrap",
                }}
              >
                ({roleName})
              </span>
            )}

            <button
              type="button"
              onClick={logout}
              style={logoutButtonStyle}
            >
              وتل
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}





