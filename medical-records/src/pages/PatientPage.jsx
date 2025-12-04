// src/pages/PatientPage.jsx
import React from "react";
import GetPatientInfo from "../components/GetPatientInfo";

export default function PatientPage() {

  return (
    <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#F8FBFF",
      padding: "2.5rem 2rem",
      fontFamily:
        "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, Poppins, system-ui, sans-serif"
    }}
  >
    <h1
      style={{
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: 700,
        marginBottom: "2.2rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#1f2937"
      }}
    >
      Patient Dashboard
    </h1>

    <section
        style={{
          background: "#fff0f6",
          padding: "1px",
          borderRadius: "26px",
          boxShadow: "0 10px 30px rgba(255, 182, 203, 0.18)",
          marginBottom: "2rem"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem 2.2rem",
            borderRadius: "26px"
          }}
        >

          <GetPatientInfo />
          
        </div>
      </section>

    </div>
  );
}

