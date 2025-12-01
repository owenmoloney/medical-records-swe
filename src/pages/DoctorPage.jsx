// src/pages/DoctorPage.jsx
import React from "react";
import RegistrationForm from "../components/RegistrationForm";
import DoctorSignup  from "../components/DoctorSignup";
import UploadDocument from "../components/UploadDocument";
import ViewPatientFiles from "../components/ViewPatientFiles";

export default function DoctorPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e0f0ff", // light blue background
        padding: "2rem",
        fontFamily: "sans-serif"
      }}
    >
      <header
        style={{
          backgroundColor: "#0077cc",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "8px",
          marginBottom: "2rem"
        }}
      >
        <h1>Doctor Dashboard</h1>
        <p>Register new patients and manage records below:</p>
      </header>

      <main
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}
      >
        <RegistrationForm />
      </main>

      <section
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}
      >
        <DoctorSignup />
      </section>

      <section
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}
      >
        <UploadDocument />
      </section>

      <section
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <ViewPatientFiles />
      </section>

    </div>
  );
}

