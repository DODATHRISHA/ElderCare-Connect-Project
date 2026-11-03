

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:2117";

function RegisteredHomes() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  const fetchHomes = async () => {
    try {
      const response = await axios.get(`${API}/GetAllHome`);
      setHomes(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      setError("Unable to load homes. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const startEdit = (home) => {
    setEditId(home.id);
    setForm({
      homeName: home.homeName ?? "",
      address: home.address ?? "",
      city: home.city ?? "",
      contactNumber: home.contactNumber ?? "",
      email: home.email ?? "",
      facilities: home.facilities ?? "",
      capacity: home.capacity ?? "",
      availableBeds: home.availableBeds ?? "",
      verificationStatus: home.verificationStatus ?? "Pending"
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateHome = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API}/UpdateHome/${editId}`, {
        ...form,
        capacity: Number(form.capacity),
        availableBeds: Number(form.availableBeds)
      });

      alert("Home details updated successfully!");
      setEditId(null);
      await fetchHomes();
    } catch (err) {
      alert("Update failed. Please check your backend UpdateHome API.");
    }
  };

  const deleteHome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this home?")) {
      return;
    }

    try {
      await axios.delete(`${API}/DeleteHome/${id}`);
      alert("Home deleted successfully!");
      await fetchHomes();
    } catch (err) {
      alert("Delete failed. Please check your backend DeleteHome API.");
    }
  };

  const fields = [
    ["homeName", "Home Name", "text"],
    ["address", "Address", "text"],
    ["city", "City", "text"],
    ["contactNumber", "Contact Number", "text"],
    ["email", "Email", "email"],
    ["facilities", "Facilities", "text"],
    ["capacity", "Capacity", "number"],
    ["availableBeds", "Available Beds", "number"]
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>💛 Registered Old-Age Homes</h1>
      <p style={styles.subtitle}>
        Find care, comfort, and support for our elders.
      </p>

      <div style={styles.navigation}>
        <Link to="/" style={styles.button}>Home</Link>
        <Link to="/register" style={styles.button}>Register a Home</Link>
      </div>

      {loading && <p>Loading homes...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && homes.length === 0 && (
        <p>No registered homes found.</p>
      )}

      <div style={styles.grid}>
        {homes.map((home) => (
          <div key={home.id} style={styles.card}>
            {editId === home.id ? (
              <form onSubmit={updateHome}>
                <h2 style={styles.cardHeading}>Edit Home Details</h2>

                {fields.map(([name, label, type]) => (
                  <label key={name} style={styles.label}>
                    {label}
                    <input
                      style={styles.input}
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      min={type === "number" ? 0 : undefined}
                    />
                  </label>
                ))}

                <label style={styles.label}>
                  Verification Status
                  <select
                    style={styles.input}
                    name="verificationStatus"
                    value={form.verificationStatus}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>

                <button type="submit" style={styles.updateButton}>
                  Update
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2 style={styles.cardHeading}>
                  {home.homeName || "Old-Age Home"}
                </h2>
                <p><strong>Address:</strong> {home.address || "N/A"}</p>
                <p><strong>City:</strong> {home.city || "N/A"}</p>
                <p><strong>Contact:</strong> {home.contactNumber || "N/A"}</p>
                <p><strong>Email:</strong> {home.email || "N/A"}</p>
                <p><strong>Facilities:</strong> {home.facilities || "N/A"}</p>
                <p><strong>Capacity:</strong> {home.capacity ?? "N/A"}</p>
                <p><strong>Available Beds:</strong> {home.availableBeds ?? "N/A"}</p>
                <p>
                  <strong>Verification:</strong>{" "}
                  {home.verificationStatus || "Pending"}
                </p>

                <div style={styles.actions}>
                  <button
                    style={styles.editButton}
                    onClick={() => startEdit(home)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteHome(home.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fffaf2",
    padding: "35px 20px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  heading: {
    color: "#70472c",
    fontSize: "32px",
    marginBottom: "10px"
  },
  subtitle: {
    color: "#666",
    marginBottom: "25px"
  },
  navigation: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "30px"
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#70472c",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "left"
  },
  card: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    overflowWrap: "anywhere"
  },
  cardHeading: {
    color: "#70472c",
    marginTop: "0"
  },
  label: {
    display: "block",
    marginBottom: "12px",
    fontWeight: "bold",
    color: "#70472c"
  },
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "18px"
  },
  editButton: {
    flex: 1,
    padding: "11px",
    backgroundColor: "#287a48",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    flex: 1,
    padding: "11px",
    backgroundColor: "#c62828",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  updateButton: {
    padding: "11px 20px",
    marginRight: "8px",
    backgroundColor: "#287a48",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  cancelButton: {
    padding: "11px 20px",
    backgroundColor: "#777",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: {
    color: "#b00020",
    fontWeight: "bold"
  }
};

export default RegisteredHomes;
