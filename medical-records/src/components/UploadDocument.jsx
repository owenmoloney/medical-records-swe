import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SearchPatient from "./SearchPatient";

function UploadDocument() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      setDoctorId(auth.currentUser.uid);
    }
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    if (!selectedPatient) return alert("Please select a patient first.");
    if (!doctorId) return alert("You must be logged in as a doctor.");

    const patientId = selectedPatient.id;
    const filePath = `patients/${patientId}/${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            uploadedBy: doctorId,
            uploadedAt: serverTimestamp(),
          });

          alert("Upload complete!");
          setFile(null);
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

      <SearchPatient doctorId={doctorId} onSelectPatient={setSelectedPatient} />

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>File</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.1rem"
          }}
        >
          <button onClick={handleUpload} style={buttonUpload}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
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
