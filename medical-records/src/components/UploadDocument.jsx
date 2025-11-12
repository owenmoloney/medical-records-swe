import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SearchPatient from "./SearchPatient";

export default function UploadDocument() {
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
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2 className="text-lg font-semibold mb-3">Upload File for Patient</h2>

      <SearchPatient doctorId={doctorId} onSelectPatient={setSelectedPatient} />

      <div>
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} />
        {uploading && <p>Progress: {progress}%</p>}
      </div>

      <button
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
        onClick={handleUpload}
        disabled={uploading || !doctorId || !selectedPatient || !file}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
