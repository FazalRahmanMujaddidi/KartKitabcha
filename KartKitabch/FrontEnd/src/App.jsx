// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import ProvincesAndCitiesPage from "./pages/ProvincesAndCities";
// import CompanyLocationPage from "./pages/CompanyLocationPage";
// import Header from "./components/Header";
// import CompanyPage from "./pages/Company";
// import Vehicle from "./pages/Vehicle";
// import ReportPage from "./pages/Report";
// import OfficeContentPage from "./pages/OfficeContentPage";
// import LetterPage from "./pages/Letter";
// import PersonPage from "./pages/Person";
// import "react-toastify/dist/ReactToastify.css";
// import Maktob from "./components/letter/maktob";
// import LetterContent from "./components/letter/lettercontent";
// import SenderPage from "./pages/SenderPage";
// import ReportSummary from "./pages/ReportSummary";
// import GPSCompany from "./pages/GPSCompany";
// import ReportFilter from "./pages/ReportFilter";
// import { ToastContainer } from "react-toastify";



// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Header />

//         <Routes>
//           <Route path="/" element={<ReportFilter />} />
//           <Route path="/companies" element={<CompanyPage />} />
//           <Route path="/provinces" element={<ProvincesAndCitiesPage />} />
//           <Route path="/company-location" element={<CompanyLocationPage />} />
//           <Route path="/vehicle" element={<Vehicle />} />
//           <Route path="/report" element={<ReportPage />} />
//           <Route path="/gpscompany" element={<GPSCompany />} />
//           <Route path="/officecontent" element={<OfficeContentPage />} />
//           <Route path="/letter" element={<LetterPage />} />
//           <Route path="/maktob" element={<Maktob />} />
//           <Route path="/person" element={<PersonPage />} />
//           <Route path="/lettercontent" element={<LetterContent />} />
//           <Route path="/sender" element={<SenderPage />} />
//         </Routes>
//       </BrowserRouter>

//       <ToastContainer
//         position="top-right"
//         autoClose={1000} s
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Existing pages
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
// Authentication
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function AppRoutes() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/login" element={<Login />} />


      {/* Existing application */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <>
              <Header />

              <Routes>
                <Route
                  path="/"
                  element={<ReportFilter />}
                />

                <Route
                  path="/companies"
                  element={<CompanyPage />}
                />

                <Route
                  path="/provinces"
                  element={<ProvincesAndCitiesPage />}
                />

                <Route
                  path="/company-location"
                  element={<CompanyLocationPage />}
                />

                <Route
                  path="/vehicle"
                  element={<Vehicle />}
                />

                <Route
                  path="/report"
                  element={<ReportPage />}
                />

                <Route
                  path="/gpscompany"
                  element={<GPSCompany />}
                />
                <Route
                  path="/users"
                  element={<Users />}
                />
                <Route
                  path="/officecontent"
                  element={<OfficeContentPage />}
                />

                <Route
                  path="/letter"
                  element={<LetterPage />}
                />

                <Route
                  path="/maktob"
                  element={<Maktob />}
                />

                <Route
                  path="/person"
                  element={<PersonPage />}
                />

                <Route
                  path="/lettercontent"
                  element={<LetterContent />}
                />

                <Route
                  path="/sender"
                  element={<SenderPage />}
                />

                {/* Unknown page */}
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        pauseOnHover
        theme="colored"
      />

    </BrowserRouter>
  );
}


export default App;

