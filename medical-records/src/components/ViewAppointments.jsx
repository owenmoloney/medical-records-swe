import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";

export default function ViewAppointments() {
  const [patientUid, setPatientUid] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Helper to format full address
  const formatAddress = (address) => {
    if (!address) return "Unknown";
    const { street, city, state, zip } = address;
    const line1 = street || "";
    const line2 = [city, state, zip].filter(Boolean).join(", ");
    return line1 ? `${line1}, ${line2}` : line2 || "Unknown";
  };

  // 1️⃣ Get patient UID from Patients collection
  useEffect(() => {
    const fetchPatientUid = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const patientQuery = query(
          collection(db, "Patients"),
          where("uid", "==", user.uid)
        );
        const snap = await getDocs(patientQuery);

        if (!snap.empty) {
          setPatientUid(snap.docs[0].data().uid);
        } else {
          console.warn("No patient record found for this user.");
        }
      } catch (err) {
        console.error("Error fetching patient UID:", err);
      }
    };

    fetchPatientUid();
  }, []);

  // 2️⃣ Fetch appointments and doctor info
  useEffect(() => {
    if (!patientUid) return;

    const reservationsRef = collection(db, "Reservations");
    const q = query(reservationsRef, where("uid", "==", patientUid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const appointmentsWithDoctors = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const appointmentDateJS = data.appointmentDate.toDate();

          let doctorName = "Unknown Doctor";
          let fullAddress = "Unknown";

          if (data.doctorId) {
            const doctorDoc = await getDoc(doc(db, "Doctors", data.doctorId));
            if (doctorDoc.exists()) {
              const d = doctorDoc.data();
              doctorName = `${d.first_name} ${d.last_name}`;
              fullAddress = formatAddress(d.address);
            }
          }

          return { id: docSnap.id, ...data, doctorName, fullAddress, appointmentDateJS };
        })
      );

      setAppointments(appointmentsWithDoctors);
    });

    return () => unsubscribe();
  }, [patientUid]);

  // 3️⃣ Split appointments into upcoming vs past
  const now = new Date();
  const upcoming = appointments.filter((a) => a.appointmentDateJS >= now);
  const past = appointments.filter((a) => a.appointmentDateJS < now);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif" }}>
      <h2 style={titleStyle}>View Appointments</h2>
      <p style={descStyle}>View previous and upcoming appointments below.</p>

      <h3 style={sectionHeader}>Upcoming Appointments</h3>
      {upcoming.length === 0 ? (
        <p style={emptyText}>No upcoming appointments.</p>
      ) : (
        upcoming.map((a) => <AppointmentCard key={a.id} appt={a} isUpcoming />)
      )}

      <h3 style={sectionHeader}>Previous Appointments</h3>
      {past.length === 0 ? (
        <p style={emptyText}>No previous appointments.</p>
      ) : (
        past.map((a) => <AppointmentCard key={a.id} appt={a} isUpcoming={false} />)
      )}
    </div>
  );
}

// Appointment card component
function AppointmentCard({ appt, isUpcoming }) {
  const handleCancel = async () => {
    try {
      await deleteDoc(doc(db, "Reservations", appt.id));
      console.log("Appointment canceled:", appt.id);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: "0.4rem", fontSize: "0.95rem", fontWeight: 600 }}>
        <strong>Doctor:</strong> {appt.doctorName}
      </div>

      <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>
        <strong>Date:</strong> {appt.appointmentDateJS.toLocaleString()}
      </div>

      <div style={{ fontSize: "0.85rem", color: "#4b5563", marginTop: "0.25rem" }}>
        <strong>Location:</strong><br />
        {appt.fullAddress}
      </div>

      {isUpcoming && (
        <button
          onClick={handleCancel}
          style={{
            marginTop: "0.8rem",
            padding: "0.45rem 0.9rem",
            fontSize: "0.85rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Cancel Appointment
        </button>
      )}
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

const sectionHeader = {
  marginTop: "1.8rem",
  marginBottom: "0.6rem",
  fontSize: "0.85rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#374151",
};

const emptyText = {
  fontSize: "0.85rem",
  color: "#6b7280",
  marginBottom: "1rem",
};

const cardStyle = {
  background: "#ffffff",
  padding: "1rem",
  borderRadius: "16px",
  marginBottom: "1rem",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
};
