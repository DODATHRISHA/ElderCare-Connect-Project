
import React, { useState } from "react";
import "./App.css";

const initialHomes = [
  {
    id: 1,
    name: "Srimatha Old Age Home",
    city: "Hyderabad",
    address: "Kukatpally, Hyderabad, Telangana",
    phone: "09010246333",
    rating: 0,
    image: "https://unessafoundation.org/wp-content/uploads/2026/04/old-age-homes-in-india.png",
  },
  {
    id: 2,
    name: "Grace Old Age Home - 5th Branch",
    city: "Hyderabad",
    address: "16-2-277/38-1, Sardar Patel Nagar Road 15, Hyderabad",
    phone: "08555996135",
    rating: 0,
    image: "https://harshahomes.co.in/wp-content/uploads/2025/08/CH-HH-1.jpg",
  },
  {
    id: 3,
    name: "Nischantha Old Age Home",
    city: "Hyderabad",
    address: "28-766, Adarsh Marg, Hyderabad, Telangana",
    phone: "08977526795",
    rating: 0,
    image: "https://storeassets.im-cdn.com/media-manager/411507/61973604acd84f499003f04e4ecf2df5_1.%20COVER%20OLD%20AGE%20HOMES_JPEG_0x0_webp.jpg",
  },
];

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [homes, setHomes] = useState(initialHomes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ratings, setRatings] = useState({});
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedHome, setSelectedHome] = useState(null);

  const [registration, setRegistration] = useState({
    applicantName: "",
    age: "",
    address: "",
    phoneNumber: "",
    guardianName: "",
    guardianRelationship: "",
    guardianPhoneNumber: "",
    secondContactName: "",
    secondContactRelationship: "",
    secondContactPhoneNumber: "",
    supportRequired: "",
  });

  const [submittingRegistration, setSubmittingRegistration] = useState(false);

  // 3RD PAGE STATES
  const [members, setMembers] = useState([]);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [newHome, setNewHome] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    image: "",
  });

  const filteredHomes = homes.filter((home) =>
    `${home.name} ${home.city} ${home.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    setPage("dashboard");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setNewHome((previous) => ({
        ...previous,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleAddHome = (e) => {
    e.preventDefault();

    if (!newHome.image) {
      alert("Please upload a home photo.");
      return;
    }

    const home = {
      ...newHome,
      id: Date.now(),
      rating: 0,
    };

    setHomes((previous) => [...previous, home]);

    setNewHome({
      name: "",
      city: "",
      address: "",
      phone: "",
      image: "",
    });

    setShowAddForm(false);
    alert("Old age home added to the demo dashboard.");
  };

  const handleJoin = (home) => {
    setSelectedHome(home);

    setRegistration({
      applicantName: "",
      age: "",
      address: "",
      phoneNumber: "",
      guardianName: "",
      guardianRelationship: "",
      guardianPhoneNumber: "",
      secondContactName: "",
      secondContactRelationship: "",
      secondContactPhoneNumber: "",
      supportRequired: "",
    });

    setShowRegistrationForm(true);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;

    setRegistration((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // GET ALL JOINED MEMBERS
  const fetchMembers = async () => {
    try {
      const response = await fetch(
        "http://localhost:2117/GetAllRegistrations"
      );

      if (!response.ok) {
        throw new Error("Unable to fetch members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Members loading error:", error);
      alert("Unable to load joined members.");
    }
  };

  // OPEN 3RD PAGE
  const openMembersPage = async () => {
    await fetchMembers();
    setSelectedMemberDetails(null);
    setEditId(null);
    setPage("members");
  };

  // EDIT MEMBER
  const handleEditMember = (member) => {
    setEditId(member.id);
    setEditForm({ ...member });
    setSelectedMemberDetails(null);
  };

  // EDIT INPUT CHANGE
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SAVE UPDATED MEMBER DETAILS
  const handleUpdateMember = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:2117/UpdateRegistration/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Member details updated successfully!");
      setEditId(null);
      await fetchMembers();
    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to update member details.");
    }
  };

  // UPDATE MEMBER STATUS
  const handleMemberStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:2117/UpdateRegistrationStatus/${id}?status=${encodeURIComponent(status)}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      alert("Status updated successfully!");
      await fetchMembers();
    } catch (error) {
      console.error("Status update error:", error);
      alert("Unable to update status.");
    }
  };

  // DELETE MEMBER
  const handleDeleteMember = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:2117/DeleteRegistration/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Member deleted successfully!");
      setSelectedMemberDetails(null);
      await fetchMembers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete member.");
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedHome) {
      alert("Please select an old age home.");
      return;
    }

    const formData = new URLSearchParams();

    Object.entries(registration).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("homeId", selectedHome.id);
    formData.append("homeName", selectedHome.name);

    setSubmittingRegistration(true);

    try {
      const response = await fetch(
        "http://localhost:2117/CreateRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      alert("Registration submitted successfully. Status: PENDING");

      setShowRegistrationForm(false);
      setSelectedHome(null);

      // AFTER REGISTRATION OPEN 3RD PAGE
      await fetchMembers();
      setPage("members");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    } finally {
      setSubmittingRegistration(false);
    }
  };

  const handleRating = (homeId, rating) => {
    setRatings((previous) => ({
      ...previous,
      [homeId]: rating,
    }));
  };

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div className="app">
        <header className="header">
          <h1>ElderCare Connect</h1>
          <p>A Home of Hope, Love and Care</p>
        </header>

        <main className="main-container">
          <section className="welcome-section">
            <div className="welcome-text">
              <h2>You Are Not Alone ❤️</h2>
              <p>
                Every elderly person deserves love,
                respect, safety and a place to call home.
              </p>
              <p>Find a caring home for your loved ones.</p>
            </div>
          </section>

          <section className="login-section">
            <div className="login-card">
              <h2>Welcome Back!</h2>
              <p className="subtitle">
                Login to ElderCare Connect
              </p>

              <form onSubmit={handleLogin}>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="forgot">
                  <button
                    type="button"
                    onClick={() => setPage("forgot")}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button className="primary-btn" type="submit">
                  Login
                </button>
              </form>

              <p className="register-text">
                Don't have an account?{" "}
                <button onClick={() => setPage("register")}>
                  Register Now
                </button>
              </p>
            </div>
          </section>
        </main>

        <footer>
          © 2026 ElderCare Connect | Care with Love
        </footer>
      </div>
    );
  }

  // REGISTER PAGE
  if (page === "register") {
    return (
      <div className="simple-page">
        <div className="login-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join ElderCare Connect</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                "Demo registration only. Backend integration is needed to save accounts."
              );
              setPage("login");
            }}
          >
            <label>Full Name</label>
            <input type="text" placeholder="Enter full name" required />

            <label>Email Address</label>
            <input type="email" placeholder="Enter email" required />

            <label>Password</label>
            <input
              type="password"
              minLength={8}
              placeholder="Create password"
              required
            />

            <button className="primary-btn" type="submit">
              Register
            </button>
          </form>

          <p className="register-text">
            Already have an account?{" "}
            <button onClick={() => setPage("login")}>
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // FORGOT PASSWORD PAGE
  if (page === "forgot") {
    return (
      <div className="simple-page">
        <div className="login-card">
          <h2>Forgot Password?</h2>
          <p className="subtitle">
            Enter your registered email address.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                "Real OTP delivery requires a backend and email service."
              );
              setPage("otp");
            }}
          >
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email"
              required
            />

            <button className="primary-btn" type="submit">
              Send OTP
            </button>
          </form>

          <button
            className="text-btn"
            onClick={() => setPage("login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // OTP PAGE
  if (page === "otp") {
    return (
      <div className="simple-page">
        <div className="login-card">
          <h2>Verify OTP</h2>
          <p className="subtitle">
            Real OTP verification requires backend integration.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo only: the OTP has not been verified.");
              setPage("reset");
            }}
          >
            <label>Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              required
            />

            <button className="primary-btn" type="submit">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    );
  }

  // RESET PASSWORD PAGE
  if (page === "reset") {
    return (
      <div className="simple-page">
        <div className="login-card">
          <h2>Reset Password</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                "A backend is needed to securely update the password."
              );
              setPage("login");
            }}
          >
            <label>New Password</label>
            <input
              type="password"
              minLength={8}
              placeholder="Enter new password"
              required
            />

            <button className="primary-btn" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3RD PAGE - JOINED MEMBERS DETAILS
  if (page === "members") {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>ElderCare Connect</h1>
            <p>Joined Members Details</p>
          </div>

          <button
            className="logout-btn"
            onClick={() => setPage("dashboard")}
          >
            Back to Dashboard
          </button>
        </header>

        <section className="home-list-section">
          <div className="list-heading">
            <div>
              <h2>All Joined Members</h2>
              <p>{members.length} members registered</p>
            </div>

            <button
              className="primary-btn"
              onClick={fetchMembers}
            >
              Refresh Members
            </button>
          </div>

          {members.length === 0 ? (
            <p className="no-results">
              No joined members found.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                border="1"
                cellPadding="12"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  color: "#333",
                }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Applicant Name</th>
                    <th>Age</th>
                    <th>Phone Number</th>
                    <th>Old Age Home</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <React.Fragment key={member.id}>
                      <tr>
                        <td>{member.id}</td>
                        <td>{member.applicantName}</td>
                        <td>{member.age}</td>
                        <td>{member.phoneNumber}</td>
                        <td>{member.homeName}</td>

                        <td>
                          <select
                            value={member.status || "PENDING"}
                            onChange={(e) =>
                              handleMemberStatus(
                                member.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              setSelectedMemberDetails(member)
                            }
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleEditMember(member)
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteMember(member.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {selectedMemberDetails?.id === member.id && (
                        <tr>
                          <td colSpan="7">
                            <h3>Complete Member Details</h3>

                            <p>
                              <b>Applicant Name:</b>{" "}
                              {member.applicantName}
                            </p>
                            <p>
                              <b>Age:</b> {member.age}
                            </p>
                            <p>
                              <b>Address:</b> {member.address}
                            </p>
                            <p>
                              <b>Phone Number:</b> {member.phoneNumber}
                            </p>

                            <h4>Guardian Details</h4>
                            <p>
                              <b>Name:</b> {member.guardianName}
                            </p>
                            <p>
                              <b>Relationship:</b>{" "}
                              {member.guardianRelationship}
                            </p>
                            <p>
                              <b>Phone:</b>{" "}
                              {member.guardianPhoneNumber}
                            </p>

                            <h4>Second Contact Details</h4>
                            <p>
                              <b>Name:</b> {member.secondContactName}
                            </p>
                            <p>
                              <b>Relationship:</b>{" "}
                              {member.secondContactRelationship}
                            </p>
                            <p>
                              <b>Phone:</b>{" "}
                              {member.secondContactPhoneNumber}
                            </p>

                            <h4>Old Age Home Details</h4>
                            <p>
                              <b>Home ID:</b> {member.homeId}
                            </p>
                            <p>
                              <b>Home Name:</b> {member.homeName}
                            </p>
                            <p>
                              <b>Support Required:</b>{" "}
                              {member.supportRequired || "-"}
                            </p>
                            <p>
                              <b>Status:</b> {member.status}
                            </p>

                            <button
                              onClick={() =>
                                setSelectedMemberDetails(null)
                              }
                            >
                              Close Details
                            </button>
                          </td>
                        </tr>
                      )}

                      {editId === member.id && (
                        <tr>
                          <td colSpan="7">
                            <h3>Edit Member Details</h3>

                            {[
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
                              ["supportRequired", "Support Required"],
                            ].map(([name, label]) => (
                              <div key={name}>
                                <label>{label}</label>

                                <input
                                  name={name}
                                  value={editForm[name] || ""}
                                  onChange={handleEditChange}
                                />
                              </div>
                            ))}

                            <button
                              className="primary-btn"
                              onClick={() =>
                                handleUpdateMember(member.id)
                              }
                            >
                              Save Changes
                            </button>

                            <button
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          © 2026 ElderCare Connect | Care with Love
        </footer>
      </div>
    );
  }

  // DASHBOARD PAGE
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>ElderCare Connect</h1>
          <p>Find a home filled with love, safety and care.</p>
        </div>

        <div>
          <button
            className="primary-btn"
            onClick={openMembersPage}
          >
            Joined Members Details
          </button>

          <button
            className="logout-btn"
            onClick={() => setPage("login")}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-banner">
        <h2>Find a Caring Home for Your Loved Ones ❤️</h2>
        <p>Search by home name, city or location.</p>

        <input
          className="search-box"
          type="search"
          placeholder="Search Srimatha, Grace, Hyderabad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="home-list-section">
        <div className="list-heading">
          <div>
            <h2>Old Age Homes in Hyderabad</h2>
            <p>{filteredHomes.length} homes found</p>
          </div>

          <button
            className="primary-btn add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "+ Register Your Home"}
          </button>
        </div>

        {showAddForm && (
          <form className="add-home-form" onSubmit={handleAddHome}>
            <h2>Register Your Old Age Home</h2>
            <p>
              Representatives can add their home details and photo here.
            </p>

            <label>Home Name</label>
            <input
              value={newHome.name}
              onChange={(e) =>
                setNewHome({ ...newHome, name: e.target.value })
              }
              placeholder="Enter home name"
              required
            />

            <label>City</label>
            <input
              value={newHome.city}
              onChange={(e) =>
                setNewHome({ ...newHome, city: e.target.value })
              }
              placeholder="Enter city"
              required
            />

            <label>Full Address</label>
            <input
              value={newHome.address}
              onChange={(e) =>
                setNewHome({ ...newHome, address: e.target.value })
              }
              placeholder="Enter complete address"
              required
            />

            <label>Contact Number</label>
            <input
              type="tel"
              value={newHome.phone}
              onChange={(e) =>
                setNewHome({ ...newHome, phone: e.target.value })
              }
              placeholder="Enter contact number"
              required
            />

            <label>Upload Home Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />

            {newHome.image && (
              <img
                className="upload-preview"
                src={newHome.image}
                alt="Home preview"
              />
            )}

            <button className="primary-btn" type="submit">
              Add Home
            </button>
          </form>
        )}

        {showRegistrationForm && selectedHome && (
          <form
            className="add-home-form"
            onSubmit={handleRegistrationSubmit}
          >
            <h2>Join {selectedHome.name}</h2>
            <p>
              Please enter the joining person's details and two family contacts.
            </p>

            <h3>Joining Person Details</h3>

            <label>Joining Person Name</label>
            <input
              name="applicantName"
              value={registration.applicantName}
              onChange={handleRegistrationChange}
              placeholder="Enter full name"
              required
            />

            <label>Age</label>
            <input
              type="number"
              name="age"
              min="1"
              value={registration.age}
              onChange={handleRegistrationChange}
              placeholder="Enter age"
              required
            />

            <label>Full Address</label>
            <textarea
              name="address"
              value={registration.address}
              onChange={handleRegistrationChange}
              placeholder="Enter full address"
              required
            />

            <label>Joining Person Contact Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={registration.phoneNumber}
              onChange={handleRegistrationChange}
              placeholder="Enter contact number"
              required
            />

            <h3>Family Member 1 Details</h3>

            <label>Member 1 Name</label>
            <input
              name="guardianName"
              value={registration.guardianName}
              onChange={handleRegistrationChange}
              placeholder="Enter member 1 name"
              required
            />

            <label>Relationship</label>
            <input
              name="guardianRelationship"
              value={registration.guardianRelationship}
              onChange={handleRegistrationChange}
              placeholder="Example: Son, Daughter"
              required
            />

            <label>Member 1 Contact Number</label>
            <input
              type="tel"
              name="guardianPhoneNumber"
              value={registration.guardianPhoneNumber}
              onChange={handleRegistrationChange}
              placeholder="Enter member 1 phone number"
              required
            />

            <h3>Family Member 2 Details</h3>

            <label>Member 2 Name</label>
            <input
              name="secondContactName"
              value={registration.secondContactName}
              onChange={handleRegistrationChange}
              placeholder="Enter member 2 name"
              required
            />

            <label>Relationship</label>
            <input
              name="secondContactRelationship"
              value={registration.secondContactRelationship}
              onChange={handleRegistrationChange}
              placeholder="Example: Son, Daughter"
              required
            />

            <label>Member 2 Contact Number</label>
            <input
              type="tel"
              name="secondContactPhoneNumber"
              value={registration.secondContactPhoneNumber}
              onChange={handleRegistrationChange}
              placeholder="Enter member 2 phone number"
              required
            />

            <label>Support Required</label>
            <textarea
              name="supportRequired"
              value={registration.supportRequired}
              onChange={handleRegistrationChange}
              placeholder="Describe the support required"
            />

            <p>
              <strong>Selected Home:</strong> {selectedHome.name}
            </p>

            <button
              className="primary-btn"
              type="submit"
              disabled={submittingRegistration}
            >
              {submittingRegistration
                ? "Submitting..."
                : "Submit Registration"}
            </button>

            <button
              className="text-btn"
              type="button"
              onClick={() => {
                setShowRegistrationForm(false);
                setSelectedHome(null);
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="home-grid">
          {filteredHomes.map((home) => (
            <article className="home-card" key={home.id}>
              <img
                className="home-image"
                src={home.image}
                alt={home.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="home-info">
                <h3>{home.name}</h3>
                <p>📍 {home.address}</p>
                <p>📞 {home.phone}</p>

                <div className="rating">
                  <span>
                    ⭐ {home.rating || "No rating yet"}
                  </span>

                  <div className="rating-input">
                    Your rating:{" "}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        aria-label={`Rate ${star} stars`}
                        onClick={() => handleRating(home.id, star)}
                      >
                        {star <= (ratings[home.id] || 0)
                          ? "★"
                          : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => handleJoin(home)}
                >
                  Register
                </button>

                <a
                  className="map-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    home.name + " " + home.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Map
                </a>
              </div>
            </article>
          ))}
        </div>

        {filteredHomes.length === 0 && (
          <p className="no-results">
            No homes found. Try another home name or city.
          </p>
        )}
      </section>

      <footer>
        © 2026 ElderCare Connect | Care with Love
      </footer>
    </div>
  );
}

export default App;
