// src/components/DoctorSignup.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function DoctorSignup() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    specialty: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2️⃣ Generate patient_id
      const doctor_id = Date.now();

      // 3️⃣ Add patient to Patients collection
      await addDoc(collection(db, "Doctors"), {
        ...formData,
        doctor_id,
        user_id: user.uid,
        phone_number: Number(formData.phone_number),
        created_at: Timestamp.now()
      });

      // 4️⃣ Add user to Users collection for login
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: formData.email,
        role: "doctor",
        created_at: Timestamp.now()
      });

      setStatus("✅ Doctor registered successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      setStatus("❌ Error adding doctor. Check console.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input name="first_name" value={formData.first_name} onChange={handleChange} required />

        <label>Last Name:</label>
        <input name="last_name" value={formData.last_name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input name="phone_number" value={formData.phone_number} onChange={handleChange} required />

        <button type="submit" style={{ marginTop: "1rem" }}>Register</button>
      </form>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );

}