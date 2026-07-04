import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import CompanyPage from "./pages/Company";

export default function App() {
  return (
    <BrowserRouter>

      {/* HEADER */}
      <Header />

      {/* ROUTES */}
      <Routes>

        <Route path="/companies" element={<CompanyPage />} />
      </Routes>

    </BrowserRouter>
  );
}