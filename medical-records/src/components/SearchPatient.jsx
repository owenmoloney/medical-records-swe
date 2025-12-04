import React, {useState} from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function SearchPatient({ onSelectPatient, doctorId, setFiles, setSelectedFile }) {
  const [lastName, setLastName] = useState("");
  const [patients, setPatients] = useState([]);

  const handleBack = () => {
    setLastName("");
    setPatients([]);
    onSelectPatient(null);
    if (setFiles) setFiles([]);
    if (setSelectedFile) setSelectedFile(null);
  };

  const handleSearch = async () => {
    if (!lastName.trim()) return alert("Enter a last name.");
    if (!doctorId) return alert("You must be logged in as a doctor.");

    try {
      const patientsRef = collection(db, "Patients");
      const q = query(patientsRef, where("last_name", "==", lastName.trim()));
      const snapshot = await getDocs(q);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (results.length === 0) {
        alert("No patients found with that last name.");
      }

      setPatients(results);
      onSelectPatient(null);
    } catch (error) {
      console.error("Error searching patients:", error);
      alert("Unable to search patients. Check your permissions.");
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        <label style={labelStyle}>Search by Last Name</label>
        <input
          type="text"
          id="lastName"
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
          marginTop: "1.1rem",
        }}
      >
        <button type="button" style={buttonSecondary} onClick={handleBack}>
          Back
        </button>
        <button onClick={handleSearch} style={buttonSearch}>
          Search
        </button>
      </div>

      {patients.length > 0 && (
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Select Patient:</label>
          <select
            style={inputStyle}
            onChange={(e) =>
              onSelectPatient(patients.find((p) => p.id === e.target.value))
            }
            defaultValue=""
          >
            <option value="">-- Choose Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} — DOB:{" "}
                {p.date_of_birth ? p.date_of_birth : "N/A"}
              </option>
            ))}
          </select>
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

