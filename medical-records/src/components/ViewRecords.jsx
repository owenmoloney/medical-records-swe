import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export default function ViewRecords() {
  const [patientId, setPatientId] = useState(null);
  const [files, setFiles] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("");

  // Reset selected file when filters change
  useEffect(() => {
    setSelectedFile(null);
  }, [filterType, appointmentFilter]);

  // Get logged-in patient document ID
  useEffect(() => {
    const fetchPatientId = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "Patients"),
        where("uid", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setPatientId(snapshot.docs[0].id);
      }
    };

    fetchPatientId();
  }, []);

  // Fetch patient appointments (optional filter source)
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchAppointments = async () => {
      const q = query(
        collection(db, "Reservations"),
        where("uid", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      setAppointments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    fetchAppointments();
  }, []);

  // Fetch files
  useEffect(() => {
    if (!patientId) return;

    const fetchFiles = async () => {
      const snapshot = await getDocs(
        collection(db, `Patients/${patientId}/files`)
      );

      setFiles(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );

      setSelectedFile(null);
      setFilterType("");
      setAppointmentFilter("");
    };

    fetchFiles();
  }, [patientId]);

  // Apply filters
  const filteredFiles = files.filter((f) => {
    const typeMatch = filterType ? f.uploadType === filterType : true;
    const apptMatch = appointmentFilter
      ? f.appointmentId === appointmentFilter
      : true;

    return typeMatch && apptMatch;
  });

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>View Records</h2>

      <p style={subtitleStyle}>
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

      {/* Optional appointment filter */}
      {appointments.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Filter by Appointment:</label>
          <select
            style={inputStyle}
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value)}
          >
            <option value="">All Appointments</option>
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.appointmentDate?.toDate
                  ? a.appointmentDate.toDate().toLocaleString()
                  : "Unknown date"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* File selector */}
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
            value={selectedFile?.id || ""}
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

      {/* Preview */}
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
              style={{
                width: "100%",
                maxHeight: "600px",
                objectFit: "contain"
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: 520,
  margin: "0 auto",
  fontFamily:
    "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
  textAlign: "left",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "1rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontSize: "0.9rem",
  color: "#6b7280",
};

const subtitleStyle = {
  textAlign: "center",
  marginBottom: "1.8rem",
  fontSize: "0.9rem",
  color: "#4b5563",
};

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
