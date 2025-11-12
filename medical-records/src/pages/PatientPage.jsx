// src/pages/PatientPage.jsx
import React from "react";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function PatientPage() {
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

  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setStatus("Fetching patient info...");

        try {

          const q = query(
            collection(db, "Patients"),
            where("user_id", "==", auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const patientData = querySnapshot.docs[0].data();
            if (patientData.date_of_birth && patientData.date_of_birth.seconds) {
              patientData.date_of_birth = new Date(patientData.date_of_birth.seconds * 1000).toLocaleDateString();
            }
            setFormData(patientData);
            setStatus("Patient info loaded");
          } else {
            setStatus("No patient record found");
          }

        } catch (error) {
          console.error("Error fetching patient data:", error);
          setStatus("Error fetching data");
        }
      } else {
        setUser(null);
        setStatus("No user logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e0f0ff", // light blue background
        padding: "2rem",
        fontFamily: "sans-serif"
      }}
    >
      <header
        style={{
          backgroundColor: "#0077cc",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "8px",
          marginBottom: "2rem"
        }}
      >
        <h1>Patient Dashboard</h1>
        <p>View and update information and documents below:</p>
      </header>

      <section
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Patient Info</h2>
        <p style={{ color: "#666" }}>{status}</p>

        {user && (
          <div style={{ marginTop: "1rem", lineHeight: "1.8" }}>
            <p><strong>First Name:</strong> {formData.first_name}</p>
            <p><strong>Last Name:</strong> {formData.last_name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Date of Birth:</strong> {formData.date_of_birth}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Phone Number:</strong> {formData.phone_number}</p>
            <p><strong>Emergency Contact Name:</strong> {formData.emergency_contact_name}</p>
            <p><strong>Emergency Contact Phone:</strong> {formData.emergency_contact_phone}</p>
          </div>
        )}

        <button
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "not-allowed"
          }}
          disabled
        >
          Edit (Not Functional Yet)
        </button>
      </section>

    </div>
  );
}

