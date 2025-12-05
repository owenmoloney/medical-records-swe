import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
     <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-nav-left">
          <span className="landing-logo">MedMMO</span>
        </div>
        <nav className="landing-nav-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contacts</a>
        </nav>
        <Link to="/login">
          <button className="landing-login-btn">
            Login
          </button>
        </Link>
      </header>

      <main className="landing-main">
        <div className="landing-text">
          <h1>
            <span className="landing-line1">Find a</span>
            <span className="landing-line2">DOCTOR</span>
          </h1>
          <p className="landing-subtitle">
            Your secure portal to manage medical records and connect with professionals.
          </p>
          <Link to="/FindDoctor">
            <button className="btn-primary landing-cta"> Get Started </button>
          </Link>
        </div>

        <div className="landing-image">
          <img src="Med_LandingPage.jpg" alt="Doctor" />
        </div>
      </main>
    </div>
  );
}