
import React, { useEffect, useState } from "react";

const API = "http://localhost:2117";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const fields = [
    ["applicantName", "Applicant Name"],
    ["age", "Age"],
    ["address", "Address"],
    ["phoneNumber", "Phone Number"],
    ["guardianName", "Guardian Name"],
    ["guardianRelationship", "Guardian Relationship"],
    ["guardianPhoneNumber", "Guardian Phone Number"],
    ["secondContactName", "Second Contact Name"],
    ["secondContactRelationship", "Second Contact Relationship"],
    ["secondContactPhoneNumber", "Second Contact Phone Number"],
    ["supportRequired", "Support Required"]
  ];

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/GetAllRegistrations`);

      if (!response.ok) {
        throw new Error("Unable to fetch members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      alert("Members details load avvaledu!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (member) => {
    setSelectedMember(member.id);
    setFormData({ ...member });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API}/UpdateRegistration/${selectedMember}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Member details updated successfully!");
      setSelectedMember(null);
      setFormData({});
      fetchMembers();
    } catch (error) {
      alert("Update failed! Backend API check cheyyi.");
      console.error(error);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API}/UpdateRegistrationStatus/${id}?status=${encodeURIComponent(status)}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      alert("Registration status updated!");
      fetchMembers();
    } catch (error) {
      alert("Status update failed!");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/DeleteRegistration/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Member deleted successfully!");
      fetchMembers();
    } catch (error) {
      alert("Delete failed!");
      console.error(error);
    }
  };

  const styles = {
    page: {
      padding: "25px",
      fontFamily: "Arial, sans-serif",
      background: "#f7f8fc",
      minHeight: "100vh"
    },
    heading: {
      color: "#263238",
      marginBottom: "20px"
    },
    tableContainer: {
      overflowX: "auto",
      background: "white",
      borderRadius: "10px",
      padding: "15px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "850px"
    },
    th: {
      background: "#315c72",
      color: "white",
      padding: "12px",
      textAlign: "left"
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #ddd"
    },
    button: {
      padding: "8px 12px",
      margin: "3px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    input: {
      width: "100%",
      padding: "10px",
      marginTop: "5px",
      marginBottom: "15px",
      boxSizing: "border-box",
      border: "1px solid #ccc",
      borderRadius: "5px"
    },
    form: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px"
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Joined Members Details</h2>

      {selectedMember !== null && (
        <div style={styles.form}>
          <h3>Edit Member Details</h3>

          {fields.map(([name, label]) => (
            <div key={name}>
              <label>{label}</label>
              <input
                style={styles.input}
                type={name === "age" ? "number" : "text"}
                name={name}
                value={formData[name] ?? ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <button
            style={{
              ...styles.button,
              background: "#218838",
              color: "white"
            }}
            onClick={handleSave}
          >
            Save Changes
          </button>

          <button
            style={{
              ...styles.button,
              background: "#777",
              color: "white"
            }}
            onClick={() => {
              setSelectedMember(null);
              setFormData({});
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Applicant Name</th>
                <th style={styles.th}>Age</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Old Age Home</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td style={styles.td}>{member.id}</td>
                  <td style={styles.td}>{member.applicantName}</td>
                  <td style={styles.td}>{member.age}</td>
                  <td style={styles.td}>{member.phoneNumber}</td>
                  <td style={styles.td}>{member.homeName}</td>

                  <td style={styles.td}>
                    <select
                      value={member.status || "PENDING"}
                      onChange={(e) =>
                        handleStatus(member.id, e.target.value)
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.button,
                        background: "#007bff",
                        color: "white"
                      }}
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        ...styles.button,
                        background: "#dc3545",
                        color: "white"
                      }}
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <p>No registered members found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MembersPage;
