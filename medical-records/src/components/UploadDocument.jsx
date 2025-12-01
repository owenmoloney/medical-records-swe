import React, { useState } from "react";

function UploadDocument() {
  const [lastName, setLastName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Upload for:", lastName, file);
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
        Upload File For Patient
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#6b7280",
          marginBottom: "1.6rem"
        }}
      >
        Search for the patient and attach a document to their record.
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

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0] || null)}
            style={{
              fontSize: "0.85rem"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.1rem"
          }}
        >
          <button type="submit" style={buttonUpload}>
            Upload
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

const buttonUpload = {
  border: "none",
  borderRadius: "999px",
  padding: "0.75rem 1.9rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  background: "linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)",
  color: "#ffffff",
  boxShadow: "0 8px 22px rgba(59,130,246,0.22)",
  transition: "0.3s ease"
};

export default UploadDocument;
