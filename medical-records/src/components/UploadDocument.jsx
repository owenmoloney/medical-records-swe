import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SearchPatient from "./SearchPatient";

function UploadDocument() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [uploadType, setUploadType] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      setDoctorId(auth.currentUser.uid);
    }
  }, []);

  // Fetch appointments for selected patient
  useEffect(() => {
    if (!selectedPatient) return;

    const fetchAppointments = async () => {
      const q = query(
        collection(db, "Reservations"),
        where("uid", "==", selectedPatient.uid)
      );

      const snap = await getDocs(q);
      const appts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAppointments(appts);
    };

    fetchAppointments();
  }, [selectedPatient]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    if (!selectedPatient) return alert("Please select a patient first.");
    if (!doctorId) return alert("You must be logged in as a doctor.");
    if (!uploadType) return alert("Please select an upload type.");

    const patientId = selectedPatient.id;
    const filePath = `patients/${patientId}/${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setProgress(0);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(pct));
      },
      (error) => {
        console.error("Upload error:", error);
        alert("Upload failed.");
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, `Patients/${patientId}/files`), {
            name: file.name,
            url: downloadURL,
            uploadType,
            uploadedBy: doctorId,
            uploadedAt: serverTimestamp(),
            appointmentId: selectedAppointment || null,
          });

          alert("Upload complete!");
          setFile(null);
          setUploadType("");
          setSelectedAppointment("");
          setProgress(0);
        } catch (error) {
          console.error("Error saving file metadata:", error);
          alert("Failed to save file information.");
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Upload File For Patient</h2>

      <SearchPatient
        doctorId={doctorId}
        onSelectPatient={setSelectedPatient}
      />

      {/* Upload Type */}
      <div style={fieldGroup}>
        <label style={labelStyle}>Upload Type</label>
        <select
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select type</option>
          <option value="Forms">Forms</option>
          <option value="Test Results">Test Results</option>
          <option value="Scans">Scans</option>
          <option value="Notes">Notes</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* OPTIONAL Appointment Selector */}
      {appointments.length > 0 && (
        <div style={fieldGroup}>
          <label style={labelStyle}>Assign to Appointment (Optional)</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            style={inputStyle}
          >
            <option value="">No appointment</option>
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                {new Date(a.appointmentDate.seconds * 1000).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* File Input */}
      <div style={fieldGroup}>
        <label style={labelStyle}>File</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          style={inputStyle}
        />
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div style={progressWrapper}>
          <div style={{ ...progressBar, width: `${progress}%` }} />
          <span style={progressText}>{progress}%</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1.2rem" }}>
        <button onClick={handleUpload} style={buttonUpload}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: 520,
  margin: "0 auto",
  fontFamily:
    "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "1.1rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#4b5563",
  marginBottom: "0.6rem",
};

const fieldGroup = {
  display: "grid",
  gap: "0.35rem",
  marginTop: "1rem",
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
  backgroundColor: "#f9fafb",
};

const progressWrapper = {
  marginTop: "1rem",
  background: "#e5e7eb",
  borderRadius: "999px",
  height: "10px",
  position: "relative",
};

const progressBar = {
  height: "100%",
  background: "linear-gradient(135deg, #3B82F6, #93C5FD)",
  borderRadius: "999px",
  transition: "width 0.3s ease",
};

const progressText = {
  fontSize: "0.75rem",
  textAlign: "center",
  marginTop: "0.3rem",
  color: "#374151",
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
};

export default UploadDocument;
