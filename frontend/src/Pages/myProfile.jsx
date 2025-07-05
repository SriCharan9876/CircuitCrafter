import React, { useState, useEffect } from "react";
import axios from "axios";

const MyProfile = () => {
  const [userdata, setUserData] = useState({});
  const token = localStorage.getItem("token");

  const getMyProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.fetched) {
        setUserData(res.data.me);
      } else {
        alert("Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Error occurred while fetching profile");
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", marginTop: "50px" }}>
      <h2>My Profile</h2>
      {userdata ? (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Name:</strong> {userdata.name}</p>
          <p><strong>Email:</strong> {userdata.email}</p>
          <p><strong>Role:</strong> {userdata.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MyProfile;
