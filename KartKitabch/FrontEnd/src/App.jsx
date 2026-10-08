import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// PAGES
// ============================================================

import ProvincesAndCitiesPage from "./pages/ProvincesAndCities";
import CompanyLocationPage from "./pages/CompanyLocationPage";
import Header from "./components/Header";
import CompanyPage from "./pages/Company";
import Vehicle from "./pages/Vehicle";
import ReportPage from "./pages/Report";
import OfficeContentPage from "./pages/OfficeContentPage";
import LetterPage from "./pages/Letter";
import PersonPage from "./pages/Person";
import Maktob from "./components/letter/maktob";
import LetterContent from "./components/letter/lettercontent";
import SenderPage from "./pages/SenderPage";
import ReportFilter from "./pages/ReportFilter";
import GPSCompany from "./pages/GPSCompany";
import Users from "./pages/Users";
import FinanceReport from "./pages/FinanceReport";
// ============================================================
// AUTHENTICATION
// ============================================================

import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ----------------------------------------------------------
  // CHECK AUTH LOADING
  // ----------------------------------------------------------

  if (loading) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#cdc6bd",
          color: "#343148",
          fontSize: "16px",
        }}
      >
        لطفاً انتظار وکړئ...
      </div>
    );
  }
  // ----------------------------------------------------------
  // USER NOT LOGGED IN
  // ----------------------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  // ----------------------------------------------------------
  // USER LOGGED IN
  // ----------------------------------------------------------
  return children;
}
// ============================================================
// APPLICATION
// ============================================================
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ==================================================
            LOGIN
        ================================================== */}
        <Route
          path="/login"
          element={<Login />}
        />
        {/* ==================================================
            PROTECTED APPLICATION
        ================================================== */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Header />
                <div className="page-content">
                  <Routes>
                    {/* HOME */}
                    <Route
                      path="/"
                      element={<ReportFilter />}
                    />
                    {/* COMPANIES */}
                    <Route
                      path="/companies"
                      element={<CompanyPage />}
                    />
                    {/* PROVINCES */}
                    <Route
                      path="/provinces"
                      element={<ProvincesAndCitiesPage />}
                    />
                    {/* COMPANY LOCATION */}
                    <Route
                      path="/company-location"
                      element={<CompanyLocationPage />}
                    />
                    {/* VEHICLE */}
                    <Route
                      path="/vehicle"
                      element={<Vehicle />}
                    />
                    {/* REPORT */}
                    <Route
                      path="/report"
                      element={<ReportPage />}
                    />
                    {/* GPS COMPANY */}
                    <Route
                      path="/gpscompany"
                      element={<GPSCompany />}
                    />
                    {/* USERS */}
                    <Route
                      path="/users"
                      element={<Users />}
                    />
                                        {/* Fininace */}
                    <Route
                      path="/finance-report"
                      element={<FinanceReport />}
                    />
                    {/* OFFICE CONTENT */}
                    <Route
                      path="/officecontent"
                      element={<OfficeContentPage />}
                    />
                    {/* LETTER */}
                    <Route
                      path="/letter"
                      element={<LetterPage />}
                    />
                    {/* MAKTob */}
                    <Route
                      path="/maktob"
                      element={<Maktob />}
                    />
                    {/* PERSON */}
                    <Route
                      path="/person"
                      element={<PersonPage />}
                    />
                    {/* LETTER CONTENT */}
                    <Route
                      path="/lettercontent"
                      element={<LetterContent />}
                    />
                    {/* SENDER */}
                    <Route
                      path="/sender"
                      element={<SenderPage />}
                    />
                    {/* UNKNOWN PAGE */}
                    <Route
                      path="*"
                      element={
                        <Navigate
                          to="/"
                          replace
                        />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* ====================================================
          TOAST NOTIFICATIONS
      ==================================================== */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        pauseOnHover
        theme="colored"
      />

    </AuthProvider>
  );
}

export default App;