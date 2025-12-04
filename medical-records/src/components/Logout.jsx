import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);     // Firebase logout
      navigate("/");     
      window.location.reload();    // Redirect to homepage
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        border: "none",
        borderRadius: "999px",
        display: "block",
        margin: "1.5rem auto 0 auto",
        padding: "0.75rem 1.9rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        cursor: "pointer",
        background: "linear-gradient(135deg, #EF4444 0%, #FCA5A5 100%)",
        color: "#ffffff",
        boxShadow: "0 8px 22px rgba(239,68,68,0.22)",
        transition: "0.3s ease"
      }}
    >
      Logout
    </button>
  );
}