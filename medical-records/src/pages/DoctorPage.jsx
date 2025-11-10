// src/pages/DoctorPage.jsx
import React from "react";
import RegistrationForm from "../components/RegistrationForm";

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
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Upload Medical Records (UI Only)</h2>
        <p>You can upload PDFs or images of scans and other records here.</p>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Upload PDF:
            <input type="file" accept=".pdf" style={{ display: "block", marginTop: "0.5rem" }} />
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Upload Image:
            <input type="file" accept="image/*" style={{ display: "block", marginTop: "0.5rem" }} />
          </label>
        </div>

        <button
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "not-allowed"
          }}
          disabled
        >
          Upload (Not Functional Yet)
        </button>
      </section>
    </div>
  );
}

