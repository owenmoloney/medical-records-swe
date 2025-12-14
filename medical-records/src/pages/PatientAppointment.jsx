import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export default function PatientAppointment() {
  const [patientUid, setPatientUid] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch patient's UID and assigned doctorId
  useEffect(() => {
    const fetchPatient = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const patientQuery = query(
          collection(db, "Patients"),
          where("uid", "==", user.uid)
        );
        const snap = await getDocs(patientQuery);
        if (!snap.empty) {
          const patientData = snap.docs[0].data();
          setPatientUid(patientData.uid);
          setDoctorId(patientData.doctor_id);
        } else {
          console.warn("No patient record found.");
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };

    fetchPatient();
  }, []);

  // Fetch available times whenever date or doctor changes
  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    const fetchAvailableTimes = async () => {
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, "Reservations"),
          where("doctorId", "==", doctorId),
          where("appointmentDate", ">=", startOfDay),
          where("appointmentDate", "<=", endOfDay)
        );

        const snap = await getDocs(q);
        const bookedHours = snap.docs.map(doc => new Date(doc.data().appointmentDate).getHours());

        // Example: working hours 9AM–5PM
        const allTimes = Array.from({ length: 9 }, (_, i) => i + 9);
        const available = allTimes.filter(hour => !bookedHours.includes(hour));
        setAvailableTimes(available);
        setSelectedTime(""); // reset
      } catch (err) {
        console.error("Error fetching available times:", err);
      }
    };

    fetchAvailableTimes();
  }, [doctorId, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || selectedTime === "") return alert("Select date and time.");
    if (!doctorId) return alert("No assigned doctor found.");

    setLoading(true);
    try {
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(selectedTime, 0, 0, 0);

      await addDoc(collection(db, "Reservations"), {
        uid: patientUid,
        doctorId: doctorId,
        appointmentDate,
        status: "pending",
        email: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      alert("Appointment requested successfully!");
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimes([]);
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        fontFamily:
          "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
        textAlign: "left",
      }}
    >
      <h2 style={titleStyle}>Create Appointment</h2>
      <p style={descStyle}>Schedule a new appointment below.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {availableTimes.length > 0 && (
          <div>
            <label style={labelStyle}>Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(parseInt(e.target.value))}
              style={inputStyle}
              required
            >
              <option value="">Select Time</option>
              {availableTimes.map(hour => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Submitting..." : "Request Appointment"}
        </button>
      </form>
    </div>
  );
}

// Styles
const titleStyle = {
  textAlign: "center",
  marginBottom: "1rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontSize: "0.9rem",
  color: "#6b7280",
};

const descStyle = {
  textAlign: "center",
  marginBottom: "1.8rem",
  fontSize: "0.9rem",
  color: "#4b5563",
};

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

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#fff",
  background: "linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)",
  border: "none",
  borderRadius: "999px",
  cursor: "pointer",
};
