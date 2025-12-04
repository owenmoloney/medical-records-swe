// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DoctorSignup from "../components/DoctorSignup";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState(""); // new state to store role


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
    <div className="app-shell">
      <div className="card card--compact">
        <h1 className="card-title">Medical Login</h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block">
            Sign In
          </button>

          {error && <p className="form-error">{error}</p>}
        </form>

        <div style={{ marginTop: "1.25rem" }}>
          <button
            type="button"
            onClick={() => navigate("/doctor-signup")}
            className="btn-secondary btn-block"
          >
            Doctor Sign Up?
          </button>
        </div>
      </div>
    </div>
  );
}
