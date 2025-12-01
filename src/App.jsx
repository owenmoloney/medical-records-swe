
// src/App.jsx
// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import PatientPage from "./pages/PatientPage";
import DoctorPage from "./pages/DoctorPage";
import FindDoctor from "./pages/FindDoctor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/FindDoctor" element={<FindDoctor/>} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/doctor" element={<DoctorPage />} />
    </Routes>
  );
}

export default App;

