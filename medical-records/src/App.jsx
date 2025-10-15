import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Home from "./components/Home";
import Database from "./components/Database";
import NewPatient from "./components/NewPatient";

export default function App() {
  return (
    <Router>
      <AppNavbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Database />} />
          <Route path="/patients" element={<NewPatient />} />
        </Routes>
      </div>
    </Router>
  );
}
