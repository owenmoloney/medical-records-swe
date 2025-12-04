// src/pages/DoctorSignupPage.jsx
import React from "react";
import DoctorSignup from "../components/DoctorSignup";

export default function DoctorSignupPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f4ff",
        fontFamily: "sans-serif",
        padding: "2rem"
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <DoctorSignup />
      </div>
    </div>
  );
}
