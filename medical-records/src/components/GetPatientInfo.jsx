import React from "react";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function GetPatientInfo() {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: ""
  });

  const [originalData, setOriginalData] = useState(null);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [docId, setDocId] = useState(null); // track Firestore document ID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setStatus("No user logged in");
        return;
      }

      setUser(currentUser);
      setStatus("Fetching patient info...");

      try {
        const q = query(
          collection(db, "Patients"),
          where("user_id", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0];
          const patientData = docRef.data();

          if (patientData.date_of_birth?.seconds) {
            patientData.date_of_birth = new Date(
              patientData.date_of_birth.seconds * 1000
            ).toISOString().slice(0, 10); // Convert to yyyy-mm-dd for input fields
          }

          setDocId(docRef.id);
          setFormData(patientData);
          setOriginalData(patientData);
          setStatus("Patient info loaded");
        } else {
          setStatus("No patient record found");
        }

      } catch (error) {
        console.error("Error fetching patient data:", error);
        setStatus("Error fetching data");
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle input changes while editing
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Save updated data to Firestore
  const handleSave = async () => {
    if (!docId) return;

    const docRef = doc(db, "Patients", docId);
    try {
      await updateDoc(docRef, formData);
      setOriginalData(formData);
      setEditing(false);
      setStatus("Information updated!");
    } catch (error) {
      console.error("Error updating Firestore:", error);
      setStatus("Update failed.");
    }
  };

  // Cancel edits and revert values
  const handleCancel = () => {
    setFormData(originalData);
    setEditing(false);
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
        View Patient Info
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#6b7280",
          marginBottom: "1.6rem"
        }}
      >
        View and edit your information below
      </p>

      {user && (
        <div style={userInfo}>
        {Object.entries({
        "First Name": "first_name",
        "Last Name": "last_name",
        "Email": "email",
        "Address": "address",
        "Date of Birth": "date_of_birth",
        "Gender": "gender",
        "Phone Number": "phone_number",
        "Emergency Contact Name": "emergency_contact_name",
        "Emergency Contact Phone": "emergency_contact_phone"
        }).map(([label, field]) => (
        <div key={field}>
            <span style={userLabel}>{label}</span>

            {editing ? (
            field === "date_of_birth" ? (
                /* --- DATE FIELD --- */
                <input
                type="date"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={editInput}
                />

            ) : field === "gender" ? (
                /* --- GENDER DROPDOWN --- */
                <select
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={editInput}
                >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                </select>

            ) : (
                /* --- NORMAL TEXT INPUT --- */
                <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={editInput}
                />
            )
            ) : (
            <div style={userValue}>{formData[field]}</div>
            )}
        </div>
        ))}

        </div>
      )}

      {!editing ? (
        <button
          style={editButton}
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      ) : (
        <>
          <button style={saveButton} onClick={handleSave}>
            Save Changes
          </button>

          <button style={cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </>
      )}

      <p style={{ textAlign: "center", marginTop: 12, color: "#6b7280" }}>
        {status}
      </p>
    </div>
  );
}

// Styles
const userInfo = {
  marginTop: "1rem",
  lineHeight: "1.8"
};

const userLabel = {
  fontSize: "0.78rem",
  fontWeight: "600",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#374151",
  display: "block",
  marginBottom: "0.25rem"
};

const userValue = {
  width: "100%",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  padding: "0.7rem 1rem",
  fontSize: "0.9rem",
  backgroundColor: "#f9fafb",
  marginBottom: "0.75rem"
};

const editInput = {
  width: "100%",
  borderRadius: "999px",
  border: "1px solid #60A5FA",
  padding: "0.7rem 1rem",
  fontSize: "0.9rem",
  backgroundColor: "#ffffff",
  marginBottom: "0.75rem",
  outline: "none"
};

const editButton = {
  border: "none",
  borderRadius: "999px",
  padding: "0.75rem 1.9rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  background: "linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)",
  color: "#ffffff",
  boxShadow: "0 8px 22px rgba(59,130,246,0.22)",
  transition: "0.3s ease",
  width: "100%",
  marginTop: "1.5rem"
};

const saveButton = {
  ...editButton,
  background: "linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)",
  boxShadow: "0 8px 22px rgba(16,185,129,0.22)"
};

const cancelButton = {
  ...editButton,
  background: "#e5e7eb",
  color: "#374151",
  boxShadow: "none",
  marginTop: "0.8rem"
};
