import React from "react";
import RegistrationForm from "../components/RegistrationForm";
import DoctorSignup from "../components/DoctorSignup";
import UploadDocument from "../components/UploadDocument";
import ViewPatientFiles from "../components/ViewPatientFiles";

export default function DoctorPage() {
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
        Doctor Dashboard
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
          <RegistrationForm />
        </div>
      </section>

      <section
        style={{
          background: "#f3ecff",
          padding: "1px",
          borderRadius: "26px",
          boxShadow: "0 10px 30px rgba(216, 180, 254, 0.18)",
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
          <DoctorSignup />
        </div>
      </section>

      <section
        style={{
          background: "#e9f2ff",
          padding: "1px",
          borderRadius: "26px",
          boxShadow: "0 10px 30px rgba(147, 197, 253, 0.18)",
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
          <UploadDocument />
        </div>
      </section>

      <section
        style={{
          background: "#ecfff4",
          padding: "1px",
          borderRadius: "26px",
          boxShadow: "0 10px 30px rgba(167, 243, 208, 0.18)"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem 2.2rem",
            borderRadius: "26px"
          }}
        >
          <ViewPatientFiles />
        </div>
      </section>
    </div>
  );
}
