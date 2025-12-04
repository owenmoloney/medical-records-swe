import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";



function DoctorSignup() {
  const navigate = useNavigate(); // <-- put it here
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    specialty: ""
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
    // 1️⃣ Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;

    // 2️⃣ Send email verification
    await sendEmailVerification(user); // modular SDK function

    // 3️⃣ Generate doctor_id
    const doctor_id = Date.now();

    // 4️⃣ Add doctor to Doctors collection
    await addDoc(collection(db, "Doctors"), {
      ...formData,
      doctor_id,
      user_id: user.uid,
      phone_number: Number(formData.phone_number),
      created_at: Timestamp.now()
    });

    // 5️⃣ Add user to Users collection for login
    await setDoc(doc(db, "Users", user.uid), {
      uid: user.uid,
      email: formData.email,
      role: "doctor",
      created_at: Timestamp.now()
    });

    // 6️⃣ Show success message and redirect to login
    setStatus("✅ Doctor registered successfully! Check your email for verification.");
    
    // Optional: delay redirect for a few seconds so user sees the message
    setTimeout(() => {
      navigate("/login"); // make sure to import useNavigate from react-router-dom
    }, 3000);

    // 7️⃣ Reset form
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      specialty: ""
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
        fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
        textAlign: "left"
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: "1.1rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4b5563", marginBottom: "0.5rem" }}>
        Doctor Registration
      </h2>

      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6b7280", marginBottom: "1.6rem" }}>
        Create an account for a doctor to access the system.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
        <input placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Email" type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} required style={inputStyle} />

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.1rem" }}>
          <button type="button" style={buttonSecondary} onClick={() => setFormData({ first_name: "", last_name: "", email: "", password: "", phone_number: "", specialty: "" })}>
            Cancel
          </button>
          <button type="submit" style={buttonPrimary}>Register</button>
        </div>
      </form>

      {status && <p style={{ textAlign: "center", marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}

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
