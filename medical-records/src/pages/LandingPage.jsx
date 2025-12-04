import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Top-right login section */}
      <div className="landing-header">
        <nav className="nav-left">
           <Link to="/about">About</Link>
           <Link to="/services">Services</Link>
           <Link to="/contacts">Contacts</Link>
        </nav>

        <div className="login-right">
         <span>Already Have an Account?</span>
           <Link to="/login">
             <button className="login-button">Login</button>
           </Link>
        </div>
      </div>


      {/* Main content: text + image */}
      <div className="landing-main">
        <div className="landing-text">
          <h1>
             <span className="line1">Find a</span>
             <span className="line2">DOCTOR</span>         
          </h1>
          <p>Your secure portal to manage medical records and connect with professionals.</p>
          <Link to="/FindDoctor">
             <button className="get-started-button">Get Started</button>
          </Link>
        </div>
      
        <div className="landing-image">
          <img src="Med_LandingPage.jpg" alt="Doctor" />
        </div>
      </div>
    </div>
  );
}
