import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

function DoctorSignup() {
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
        Doctor Registration
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#6b7280",
          marginBottom: "1.6rem"
        }}
      >
        Create an account for a doctor to access the system.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "0.85rem"
        }}
      >
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
          <label style={labelStyle}>Doctor ID</label>
          <input
            style={inputStyle}
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.1rem"
          }}
        >
          <button
            type="button"
            style={buttonSecondary}
            onClick={() =>
              setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone_number: "",
                number: ""
              })
            }
          >
            Cancel
          </button>
          <button type="submit" style={buttonPrimary}>
            Register
          </button>
        </div>
      </form>
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

const buttonPrimary = {
  border: "none",
  borderRadius: "999px",
  padding: "0.75rem 1.8rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
  color: "#ffffff",
  boxShadow: "0 8px 22px rgba(124,58,237,0.22)",
  transition: "0.3s ease"
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

export default DoctorSignup;
