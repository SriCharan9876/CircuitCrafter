import React from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import "../Styles/myProfile.css";

const MyProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="profile-wrapper allPages">
      <h2 className="profile-heading">👤 My Profile</h2>
      {user ? (
        <div className="profile-card animate-slide-in">
          <img src={user.profilePic?.url} alt="Profile" className="userimg" />
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.generatedFile?.url && (
              <p>
                <strong>Generated File:</strong>{" "}
                <a href={user.generatedFile.url} target="_blank" rel="noopener noreferrer">
                  View File 📄
                </a>
              </p>
            )}
            <button className="profile-btn" onClick={() => navigate(`/models/mymodels`)}>
              My Models 🚀
            </button>
            <button className="profile-btn logout-btn" onClick={logout}>
              Log Out 🔒
            </button>
          </div>
        </div>
      ) : (
        <p className="loading">Loading user data...</p>
      )}
    </div>
  );
};

export default MyProfile;
