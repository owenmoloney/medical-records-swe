// src/components/BookingRegistrationForm.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const genders = ["Male", "Female", "Other"];

export default function BookingRegistrationForm({ selectedDoctor, onRegistrationComplete, onUidReady }) {
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
    emergency_contact_phone: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    if (!genders.includes(formData.gender)) {
      setStatus("❌ Invalid Gender selected.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const patient_id = Date.now();

      await addDoc(collection(db, "Patients"), {
        ...formData,
        patient_id,
        created_at: Timestamp.fromDate(new Date()),
        uid: user.uid,
        doctor_id: selectedDoctor.id
      });

      await setDoc(doc(db, "Users", user.uid), {
        email: formData.email,
        role: "patient",
        patient_id,
        doctor_id: selectedDoctor.id,
        created_at: Timestamp.fromDate(new Date())
      });
if (onUidReady) {
  onUidReady(user.uid);
}
      setStatus("Patient registered successfully! Verification email sent.");

      setFormData({
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

      if (onRegistrationComplete) onRegistrationComplete();

    } catch (error) {
      console.error("Error adding patient:", error);
      setStatus("Error adding patient. Check console.");
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    padding: "0.7rem 1rem",
    fontSize: "0.9rem",
    backgroundColor: "#f9fafb",
    marginBottom: "0.75rem"
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "999px",
    padding: "0.75rem 1.9rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)",
    color: "#ffffff",
    boxShadow: "0 8px 22px rgba(59,130,246,0.22)",
    width: "100%",
    marginTop: "1rem"
  };

  return (
    <div style={{ maxWidth: 520, margin: "1rem auto", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "1rem" }}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Register to Book Appointment</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.8rem" }}>
        
        <div>
          <label htmlFor="first_name">First Name</label>
          <input style={inputStyle} id="first_name" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="last_name">Last Name</label>
          <input style={inputStyle} id="last_name" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input style={inputStyle} type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input style={inputStyle} type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <input style={inputStyle} id="address" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input style={inputStyle} type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input style={inputStyle} id="phone_number" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="emergency_contact_name">Emergency Contact Name</label>
          <input style={inputStyle} id="emergency_contact_name" name="emergency_contact_name" placeholder="Emergency Contact Name" value={formData.emergency_contact_name} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="emergency_contact_phone">Emergency Contact Phone</label>
          <input style={inputStyle} id="emergency_contact_phone" name="emergency_contact_phone" placeholder="Emergency Contact Phone" value={formData.emergency_contact_phone} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Gender</option>
            {genders.map((gen) => (
              <option key={gen} value={gen}>{gen}</option>
            ))}
          </select>
        </div>

        <button style={buttonStyle} type="submit">Register & Continue Booking</button>

      </form>
      {status && <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}
