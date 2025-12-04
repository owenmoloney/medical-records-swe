import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import SearchPatient from "./SearchPatient";

export default function ViewPatientFiles() {
  const [doctorId, setDoctorId] = useState(null); // set via auth
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Get current doctor ID
  useEffect(() => {
    if (auth.currentUser) {
      setDoctorId(auth.currentUser.uid);
    }
  }, []);

  // Fetch files for selected patient
  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedPatient) return;

      try {
        const filesRef = collection(db, `Patients/${selectedPatient.id}/files`);
        const snapshot = await getDocs(filesRef);

        const fetchedFiles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(fetchedFiles);
        setSelectedFile(null); // reset selected file
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Failed to fetch files.");
      }
    };

    fetchFiles();
  }, [selectedPatient]);

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

      <SearchPatient doctorId={doctorId} onSelectPatient={setSelectedPatient} />

      {files.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Select File:</label>
          <select
            style={inputStyle}
            onChange={(e) =>
              setSelectedFile(files.find((f) => f.id === e.target.value))
            }
            defaultValue=""
          >
            <option value="">-- Choose File --</option>
            {files.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — Uploaded:{" "}
                {f.uploadedAt?.toDate
                  ? f.uploadedAt.toDate().toLocaleString()
                  : "N/A"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render selected file */}
      {selectedFile && (
        <div style={{ marginTop: "1rem" }}>
          {selectedFile.name.endsWith(".pdf") ? (
            <iframe
              src={selectedFile.url}
              width="100%"
              height="600px"
              title={selectedFile.name}
            />
          ) : (
            <img
              src={selectedFile.url}
              alt={selectedFile.name}
              style={{ width: "100%", maxHeight: "600px", objectFit: "contain" }}
            />
          )}
        </div>
      )}
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

