import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegistrationForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const patient_id = Date.now();

      await addDoc(collection(db, "Patients"), {
        ...formData,
        patient_id,
        created_at: Timestamp.fromDate(new Date()),
        uid: user.uid
      });

      await setDoc(doc(db, "Users", user.uid), {
        email: formData.email,
        role: "patient",
        patient_id: patient_id,
        created_at: Timestamp.fromDate(new Date())
      });

      setStatus("Patient registered successfully.");

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
    } catch (error) {
      console.error("Error adding patient:", error);
      setStatus("Error adding patient. Check console.");
    }
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
          marginBottom: "1rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontSize: "0.9rem",
          color: "#6b7280"
        }}
      >
        Patient Registration
      </h2>

      <p
        style={{
          textAlign: "center",
          marginBottom: "1.8rem",
          fontSize: "0.9rem",
          color: "#4b5563"
        }}
      >
        Please complete all required fields before submitting.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>First Name</label>
          <input
            style={inputStyle}
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Last Name</label>
          <input
            style={inputStyle}
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Address</label>
          <input
            style={inputStyle}
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Date Of Birth</label>
          <input
            style={inputStyle}
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Gender</label>
          <select
            style={inputStyle}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Phone Number</label>
          <input
            style={inputStyle}
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Emergency Contact Name</label>
          <input
            style={inputStyle}
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={labelStyle}>Emergency Contact Phone</label>
          <input
            style={inputStyle}
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            required
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "0.75rem"
          }}
        >
          <button
            type="reset"
            style={{
              ...buttonBase,
              backgroundColor: "#f3f4f6",
              color: "#374151"
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            style={{
              ...buttonBase,
              background:
                "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
              color: "#ffffff",
              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.35)"
            }}
          >
            Submit
          </button>
        </div>
      </form>

      {status && (
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#4b5563" }}>
          {status}
        </p>
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

const buttonBase = {
  border: "none",
  borderRadius: "999px",
  padding: "0.7rem 1.6rem",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer"
};
