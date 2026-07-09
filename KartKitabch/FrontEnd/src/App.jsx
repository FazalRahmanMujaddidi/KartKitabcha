import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProvincesAndCitiesPage from "./pages/ProvincesAndCities";
import CompanyLocationPage from "./pages/CompanyLocationPage";
import Header from "./components/Header";
import CompanyPage from "./pages/Company";
import Vehicle from "./pages/Vehicle";
import ReportPage from "./pages/Report";
import LetterPage from "./pages/Letter";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<LetterPage />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/provinces" element={<ProvincesAndCitiesPage />} />
          <Route path="/company-location" element={<CompanyLocationPage />} />
         <Route path="/vehicle" element={<Vehicle />} />
         <Route path="/report" element={<ReportPage/>} />
          <Route path="/letter" element={<LetterPage/>} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;