import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ViewRecords() {
  const [patientId, setPatientId] = useState(null); // current patient document ID
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterType, setFilterType] = useState("");

// Reset selected file when filtertype changes
  useEffect(() => {
    setSelectedFile(null);
  }, [filterType]);

  // Get logged-in patient ID from Firestore
  useEffect(() => {
    const fetchPatientId = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "Patients"),
          where("uid", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPatientId(snapshot.docs[0].id);
        } else {
          console.warn("No patient record found for this user.");
        }
      } catch (error) {
        console.error("Error fetching patient ID:", error);
      }
    };

    fetchPatientId();
  }, []);

  // Fetch files for current patient
  useEffect(() => {
    const fetchFiles = async () => {
      if (!patientId) return;

      try {
        const filesRef = collection(db, `Patients/${patientId}/files`);
        const snapshot = await getDocs(filesRef);

        const fetchedFiles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFiles(fetchedFiles);
        setSelectedFile(null);
        setFilterType(""); // reset filter
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Failed to fetch files.");
      }
    };

    fetchFiles();
  }, [patientId]);

  // Apply filter by file type
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
        textAlign: "left",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontSize: "0.9rem",
          color: "#6b7280",
        }}
      >
        View Records
      </h2>

      <p
        style={{
          textAlign: "center",
          marginBottom: "1.8rem",
          fontSize: "0.9rem",
          color: "#4b5563",
        }}
      >
        Review your uploaded medical records below.
      </p>

      {/* Filter by file type */}
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

      {/* File selection */}
      {filteredFiles.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Select File:</label>
          <select
            style={inputStyle}
            onChange={(e) =>
              setSelectedFile(
                filteredFiles.find((f) => f.id === e.target.value)
              )
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
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  padding: "0.7rem 1rem",
  fontSize: "0.9rem",
  outline: "none",
  backgroundColor: "#f9fafb",
};
