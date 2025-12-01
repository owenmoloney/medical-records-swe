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
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2 className="text-lg font-semibold mb-3">View Patient Files</h2>

      {/* Patient Search */}
      <SearchPatient doctorId={doctorId} onSelectPatient={setSelectedPatient} />

      {/* Files Dropdown */}
      {files.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label className="block mb-1 font-medium">Select File:</label>
          <select
            className="border p-1 rounded w-full"
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
