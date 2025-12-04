import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import SearchPatient from "./SearchPatient";

export default function ViewPatientFiles() {
  const [doctorId, setDoctorId] = useState(null); 
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterType, setFilterType] = useState(""); // NEW filter state


  // Reset selected file when filtertype changes
  useEffect(() => {
    setSelectedFile(null);
  }, [filterType]);

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
        setSelectedFile(null);
        setFilterType(""); // reset filter when patient changes
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Failed to fetch files.");
      }
    };

    fetchFiles();
  }, [selectedPatient]);

  // Filter files based on dropdown
  const filteredFiles = filterType
    ? files.filter((f) => f.uploadType === filterType)
    : files;

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

      <SearchPatient doctorId={doctorId} onSelectPatient={setSelectedPatient} setFiles={setFiles} setSelectedFile={setSelectedFile}/>

      {/* --- Filter by File Type --- */}
      {files.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Filter by Type:</label>
          <select
            style={inputStyle}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Forms">Forms</option>
            <option value="Test Results">Test Results</option>
            <option value="Scans">Scans</option>
            <option value="Notes">Notes</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      {/* --- Select File Dropdown --- */}
      {filteredFiles.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Select File:</label>
          <select
            style={inputStyle}
            onChange={(e) =>
              setSelectedFile(filteredFiles.find((f) => f.id === e.target.value))
            }
            defaultValue=""
          >
            <option value="">-- Choose File --</option>
            {filteredFiles.map((f) => (
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
