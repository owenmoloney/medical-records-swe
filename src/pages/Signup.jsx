// src/pages/Signup.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Save role in Firestore
      await setDoc(doc(db, "Users", uid), { role });

      // Redirect immediately based on role
      if (role === "doctor") navigate("/doctor");
      else navigate("/patient");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Check console.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", fontFamily: "sans-serif" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button type="submit" style={{ marginTop: "1rem" }}>Sign Up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

