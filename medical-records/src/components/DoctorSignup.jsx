import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const allowedLocations = [
  "New York City",
  "Boston",
  "New Jersey City",
  "Long Island"
];

function DoctorSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    specialty: "",
    patients: "",
    address: { street: "", city: "", state: "", zip: "" },
    location: "",
    photoFile: null
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    // ✅ Validate location
    if (!allowedLocations.includes(formData.location)) {
      setStatus("Invalid location selected.");
      return;
    }

    // ✅ Validate email domain
    if (!formData.email.endsWith("@fordham.edu")) {
      setStatus("Doctors must register with a verified email, contact your IT depart for verification");
      return;
    }

    try {
      // 1️⃣ Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      // 2️⃣ Upload photo
      const storage = getStorage();
      let photoURL = "";

      if (formData.photoFile) {
        const photoRef = ref(storage, `doctor_photos/${user.uid}_${formData.photoFile.name}`);
        await uploadBytes(photoRef, formData.photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // 3️⃣ Save doctor data
      const doctor_id = Date.now();

      await addDoc(collection(db, "Doctors"), {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        specialty: formData.specialty,
        location: formData.location,
        address: formData.address,
        patients: Number(formData.patients),
        phone_number: Number(formData.phone_number),
        doctor_id,
        user_id: user.uid,
        photoURL,
        created_at: Timestamp.now()
      });

      // 4️⃣ Save user role
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: formData.email,
        role: "doctor",
        created_at: Timestamp.now()
      });

      setStatus("✅ Doctor registered successfully!");
      setTimeout(() => navigate("/login"), 3000);

    } catch (error) {
      console.error(error);
      setStatus("❌ Error creating doctor: " + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Doctor Registration</h2>
      <p style={descStyle}>Create an account for a doctor to access the system.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
        <input placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Email" type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} required style={inputStyle} />
        <input placeholder="Street Address" name="street" value={formData.address.street} onChange={handleAddressChange} required style={inputStyle} />
        <input placeholder="City" name="city" value={formData.address.city} onChange={handleAddressChange} required style={inputStyle} />
        <input placeholder="State" name="state" value={formData.address.state} onChange={handleAddressChange} required style={inputStyle} />
        <input placeholder="ZIP Code" name="zip" value={formData.address.zip} onChange={handleAddressChange} required style={inputStyle} />
        <input placeholder="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} required style={inputStyle} />
        <input type="number" placeholder="How many patients does this Doctor have?" name="patients" value={formData.patients} onChange={handleChange} required style={inputStyle} />
        <input type="file" accept="image/*" required onChange={(e) => setFormData(prev => ({ ...prev, photoFile: e.target.files[0] }))} />
        <select name="location" value={formData.location} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Location</option>
          {allowedLocations.map(loc => (<option key={loc} value={loc}>{loc}</option>))}
        </select>

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

// Styles
const containerStyle = {
  maxWidth: 520,
  margin: "0 auto",
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
  textAlign: "left"
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

const titleStyle = {
  textAlign: "center",
  fontSize: "1.1rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#4b5563",
  marginBottom: "0.5rem"
};

const descStyle = {
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#6b7280",
  marginBottom: "1.6rem"
};

export default DoctorSignup;
