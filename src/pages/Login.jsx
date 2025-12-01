// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Get role from Firestore
      const userDoc = await getDoc(doc(db, "Users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === "doctor") navigate("/doctor");   // Redirect doctors to patient registration form
        else if (role === "patient") navigate("/patient"); // Redirect patients to their page
        else setError("Role not assigned.");
      } else {
        setError("User profile not found in Firestore.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Check email and password.");
    }
  };
return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0f0ff",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem 3rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <h1 style={{ textAlign: "center", color: "#0077cc", marginBottom: "1rem" }}>Medical Login</h1>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#0077cc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Sign In
          </button>

          {error && <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
