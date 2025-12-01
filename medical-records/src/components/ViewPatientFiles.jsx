import React, { useState } from "react";

function ViewPatientFiles() {
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search files for:", lastName);
  };

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        fontFamily:
          "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
        textAlign: "left"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.1rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#4b5563",
          marginBottom: "0.5rem"
        }}
      >
        View Patient Files
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#6b7280",
          marginBottom: "1.6rem"
        }}
      >
        Search by last name to review uploaded documents.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "0.9rem"
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Search by Last Name</label>
          <input
            style={inputStyle}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.1rem"
          }}
        >
          <button
            type="button"
            style={buttonSecondary}
            onClick={() => setLastName("")}
          >
            Back
          </button>
          <button type="submit" style={buttonSearch}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#374151"
};

const inputStyle = {
  width: "100%",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  padding: "0.7rem 1rem",
  fontSize: "0.9rem",
  outline: "none",
  backgroundColor: "#f9fafb"
};

const buttonSecondary = {
  borderRadius: "999px",
  padding: "0.75rem 1.6rem",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer",
  background: "#ffffff",
  border: "1.5px solid #D1D5DB",
  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  transition: "0.25s ease"
};

const buttonSearch = {
  border: "none",
  borderRadius: "999px",
  padding: "0.75rem 1.9rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  background: "linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)",
  color: "#ffffff",
  boxShadow: "0 8px 22px rgba(16,185,129,0.22)",
  transition: "0.3s ease"
};

export default ViewPatientFiles;
