
import React, { useEffect, useState } from "react";

const API = "http://localhost:2117";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const fields = [
    ["applicantName", "Applicant Name"],
    ["age", "Age"],
    ["address", "Address"],
    ["phoneNumber", "Phone Number"],
    ["guardianName", "Guardian Name"],
    ["guardianRelationship", "Guardian Relationship"],
    ["guardianPhoneNumber", "Guardian Phone"],
    ["secondContactName", "Second Contact Name"],
    ["secondContactRelationship", "Second Contact Relationship"],
    ["secondContactPhoneNumber", "Second Contact Phone"],
    ["supportRequired", "Support Required"]
  ];

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/GetAllRegistrations`);

      if (!response.ok) throw new Error("Unable to load members");

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
    loadMembers();
  }, []);

  const handleEdit = (member) => {
    setEditMember(member.id);
    setForm({ ...member });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API}/UpdateRegistration/${editMember}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) throw new Error("Update failed");

      alert("Member details updated!");
      setEditMember(null);
      setForm({});
      loadMembers();
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

      if (!response.ok) throw new Error("Status update failed");

      alert("Status updated successfully!");
      loadMembers();
    } catch (error) {
      alert("Status update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/DeleteRegistration/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Delete failed");

      alert("Member deleted successfully!");
      loadMembers();
    } catch (error) {
      alert("Delete failed!");
    }
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "6px 0 15px",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "8px 14px",
    margin: "4px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px"
  };

  return (
    <div style={{
      padding: "25px",
      background: "#f5f6fa",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>
      <h2>Joined Members Details</h2>

      {editMember !== null && (
        <form
          onSubmit={handleSave}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
            maxWidth: "650px"
          }}
        >
          <h3>Edit Member Details</h3>

          {fields.map(([name, label]) => (
            <div key={name}>
              <label>{label}</label>
              <input
                style={inputStyle}
                name={name}
                type={name === "age" ? "number" : "text"}
                value={form[name] ?? ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{ ...buttonStyle, background: "#218838", color: "white" }}
          >
            Save Changes
          </button>

          <button
            type="button"
            style={{ ...buttonStyle, background: "#777", color: "white" }}
            onClick={() => setEditMember(null)}
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div style={{ overflowX: "auto", background: "white", padding: "10px" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "850px"
          }}>
            <thead>
              <tr style={{ background: "#315c72", color: "white" }}>
                {["ID", "Applicant", "Age", "Phone", "Home", "Status", "Actions"].map(
                  (heading) => (
                    <th key={heading} style={{ padding: "12px" }}>
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td style={{ padding: "10px" }}>{member.id}</td>
                  <td style={{ padding: "10px" }}>{member.applicantName}</td>
                  <td style={{ padding: "10px" }}>{member.age}</td>
                  <td style={{ padding: "10px" }}>{member.phoneNumber}</td>
                  <td style={{ padding: "10px" }}>{member.homeName}</td>

                  <td style={{ padding: "10px" }}>
                    <select
                      value={member.status || "PENDING"}
                      onChange={(e) => handleStatus(member.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>

                  <td style={{ padding: "10px" }}>
                    <button
                      style={{ ...buttonStyle, background: "#007bff", color: "white" }}
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>

                    <button
                      style={{ ...buttonStyle, background: "#dc3545", color: "white" }}
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && <p>No registered members found.</p>}
        </div>
      )}
    </div>
  );
}

export default MembersPage;
