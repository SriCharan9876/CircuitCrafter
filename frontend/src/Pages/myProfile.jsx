import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import "../Styles/myProfile.css";

const MyProfile = () => {
  const { user, logout } = useAuth();
  const navigate=useNavigate();

  return (
    <div style={{ maxWidth: "600px", margin: "auto", marginTop: "50px" }} className="allPages">
      <h2>My Profile</h2>
      {user? (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Name:</strong> {user.name}</p>
          <img src={user.profilePic?.url} alt="Profile" className="userimg"/>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.generatedFile?.url && (
            <>
            <p><strong>Generated File:</strong> <a href={user.generatedFile.url} target="_blank" rel="noopener noreferrer">View File</a></p>
            </>
          )}
          <button
            className="profile-btn"
            onClick={(e) => navigate(`/models/mymodels`)}
          >My models
          </button>
          <div className="logout">
            <button className="profile-btn" onClick={logout}>LogOut</button>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MyProfile;
