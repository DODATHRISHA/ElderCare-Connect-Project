
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function HomeRegistration() {
  const navigate = useNavigate();

  const [home, setHome] = useState({
    homeName: "",
    address: "",
    city: "",
    contactNumber: "",
    email: "",
    facilities: "",
    capacity: "",
    availableBeds: "",
    verificationStatus: "Pending"
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHome((previousHome) => ({
      ...previousHome,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (Number(home.availableBeds) > Number(home.capacity)) {
      setErrorMessage("Available beds cannot exceed total capacity.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:2117/CreateHome",
        {
          ...home,
          capacity: Number(home.capacity),
          availableBeds: Number(home.availableBeds)
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 30000
        }
      );

      console.log("Registration successful:", response.data);

      alert("Old-age home registered successfully!");
      navigate("/registered-homes");
    } catch (error) {
      console.error("Registration error:", error);
      console.error("HTTP status:", error.response?.status);
      console.error("Backend response:", error.response?.data);

      let message = "";

      if (error.response) {
        message =
          "Server error: " +
          error.response.status +
          "\nDetails: " +
          (typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data));
      } else if (error.code === "ECONNABORTED") {
        message = "Request timed out. Check the backend.";
      } else if (error.request) {
        message =
          "No response received. Check whether Spring Boot is running on port 2117. If it is running, check CORS and the browser Console.";
      } else {
        message = error.message;
      }

      setErrorMessage(message);
      alert("Registration failed!\n\n" + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>

        <h1 style={styles.heading}>
          Register an Old-Age Home 💛
        </h1>

        <p style={styles.subtitle}>
          Register your home and help us connect with people who need care.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Home Name</label>
          <input
            style={styles.input}
            name="homeName"
            value={home.homeName}
            onChange={handleChange}
            placeholder="Enter home name"
            required
          />

          <label style={styles.label}>Address</label>
          <input
            style={styles.input}
            name="address"
            value={home.address}
            onChange={handleChange}
            placeholder="Enter full address"
            required
          />

          <label style={styles.label}>City</label>
          <input
            style={styles.input}
            name="city"
            value={home.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />

          <label style={styles.label}>Contact Number</label>
          <input
            style={styles.input}
            type="tel"
            name="contactNumber"
            value={home.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={home.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />

          <label style={styles.label}>Facilities</label>
          <textarea
            style={styles.textarea}
            name="facilities"
            value={home.facilities}
            onChange={handleChange}
            placeholder="Food, medical care, accommodation, etc."
            required
          />

          <label style={styles.label}>Total Capacity</label>
          <input
            style={styles.input}
            type="number"
            name="capacity"
            value={home.capacity}
            onChange={handleChange}
            placeholder="Enter total capacity"
            min="1"
            required
          />

          <label style={styles.label}>Available Beds</label>
          <input
            style={styles.input}
            type="number"
            name="availableBeds"
            value={home.availableBeds}
            onChange={handleChange}
            placeholder="Enter available beds"
            min="0"
            required
          />

          <p style={styles.status}>
            Verification Status: Pending
          </p>

          {errorMessage && (
            <p style={styles.error}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Home"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fffaf2",
    padding: "30px 15px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
  },

  card: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box"
  },

  backLink: {
    color: "#70472c",
    textDecoration: "none",
    fontWeight: "bold"
  },

  heading: {
    color: "#70472c",
    textAlign: "center",
    marginTop: "25px"
  },

  subtitle: {
    textAlign: "center",
    color: "#666666",
    marginBottom: "25px",
    lineHeight: "1.5"
  },

  label: {
    display: "block",
    marginTop: "12px",
    marginBottom: "6px",
    color: "#493321",
    fontWeight: "bold"
  },

  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "0 0 18px",
    border: "1px solid #d6c5b5",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "15px"
  },

  textarea: {
    display: "block",
    width: "100%",
    minHeight: "90px",
    padding: "12px",
    margin: "0 0 18px",
    border: "1px solid #d6c5b5",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    fontSize: "15px",
    resize: "vertical"
  },

  status: {
    color: "#8a6d3b",
    fontWeight: "bold",
    marginTop: "15px"
  },

  error: {
    color: "#b83232",
    backgroundColor: "#fff0f0",
    padding: "12px",
    borderRadius: "7px",
    overflowWrap: "anywhere"
  },

  button: {
    display: "block",
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    backgroundColor: "#70472c",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default HomeRegistration;
