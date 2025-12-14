// src/pages/FindDoctor.jsx
import React, { useState, useEffect } from "react";
import "./FindDoctor.css";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import BookingRegistrationForm from "../components/BookingRegistrationForm";
import { useNavigate } from "react-router-dom";


const formatAddress = (address) => {
  if (!address) return "Address not available";

  const { street, city, state, zip } = address;
  return `${street}, ${city}, ${state} ${zip}`;
};

export default function FindDoctor() {
  const [location, setLocation] = useState("");       
  const [doctors, setDoctors] = useState([]);         
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [email, setEmail] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false); 
  const [patientUid, setPatientUid] = useState(""); 
  const locations = ["New York City", "Boston", "New Jersey City", "Long Island"];
  const navigate = useNavigate();

  useEffect(() => {
    if (!location) return;

    const fetchDoctors = async () => {
      try {
        const doctorsRef = collection(db, "Doctors");
        const q = query(
          doctorsRef,
          where("location", "==", location),
          where("patients", "<", 6)
        );
        const snapshot = await getDocs(q);
        const doctorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [location]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;

    const fetchBookedTimes = async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, "Reservations"),
        where("doctorId", "==", selectedDoctor.id),
        where("appointmentDate", ">=", startOfDay),
        where("appointmentDate", "<=", endOfDay)
      );

      const snapshot = await getDocs(q);
      const bookedTimes = snapshot.docs.map(doc => new Date(doc.data().appointmentDate).getHours());

      const allTimes = Array.from({ length: 9 }, (_, i) => i + 9);
      const available = allTimes.filter(hour => !bookedTimes.includes(hour));
      setAvailableTimes(available);
      setSelectedTime("");
    };

    fetchBookedTimes();
  }, [selectedDoctor, selectedDate]);

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate || selectedTime === "" || !email) {
      alert("Please select doctor, date, time, and enter your email.");
      return;
    }

    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(selectedTime, 0, 0, 0);

    try {
      await addDoc(collection(db, "Reservations"), {
        doctorId: selectedDoctor.id,
        appointmentDate,
        email,
        uid: patientUid, // store patient UID
        status: "pending",
        createdAt: serverTimestamp()
      });

      alert(`Appointment requested with Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name} at ${selectedTime}:00. Please check your email to confirm.`);

      // Reset
      setSelectedDoctor(null);
      setSelectedDate("");
      setSelectedTime("");
      setEmail("");
      setAvailableTimes([]);
      setRegistrationComplete(false);
      setShowRegistration(false);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

return (
  <>
    <div className="find-doctor-banner">
      <h1>Find a Doctor in Your Area</h1>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div className="banner-accent"></div> {/* ⭐ subtle accent */}
    </div>

    <div className="find-doctor-container">

      {/* Location selector */}
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Doctor list */}
      <div className="doctor-list">
        {doctors.length === 0 && location && <p>No available doctors in this area.</p>}
        {doctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <img
              src={doc.photoURL || "/default-doctor.png"}
              alt="Doctor photo"
              className="doctor-photo"
            />

            <h3>{doc.first_name} {doc.last_name}</h3>

            <p><strong>Specialty:</strong> {doc.specialty || "General"}</p>
            <p><strong>Phone:</strong> {doc.phone_number}</p>
            <p><strong>Office Address:</strong><br />{formatAddress(doc.address)}</p>

            <button onClick={() => {
              setSelectedDoctor(doc);
              setShowRegistration(true);
              setRegistrationComplete(false);
            }}>
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Registration + booking logic unchanged */}
      {selectedDoctor && showRegistration && !registrationComplete && (
        <BookingRegistrationForm
          selectedDoctor={selectedDoctor}
          onRegistrationComplete={() => setRegistrationComplete(true)}
          onUidReady={(uid) => setPatientUid(uid)}
        />
      )}

{/* Show booking section only after registration */}
{selectedDoctor && registrationComplete && (
  <div className="booking-section">
    <h2>Book an Appointment with Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}</h2>

    <label>
      Your Email:
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
    </label>

    <label>
      Date:
      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
    </label>

    {availableTimes.length > 0 && (
      <label>
        Time:
        <select value={selectedTime} onChange={(e) => setSelectedTime(parseInt(e.target.value))}>
          <option value="">Select Time</option>
          {availableTimes.map(hour => (
            <option key={hour} value={hour}>{hour}:00</option>
          ))}
        </select>
      </label>
    )}

    <button onClick={handleBook}>Request Appointment</button>
  </div>
)}

    </div>
  </>
);
}
