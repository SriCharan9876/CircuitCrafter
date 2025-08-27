import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import "../Styles/myProfile.css";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";
import { notify } from "../features/toastManager";

const MyProfile = () => {
  const { user, logout,token } = useAuth();
  const navigate = useNavigate();
  const deleteAcc=async()=>{
    const deletion = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/auth/deleteAccount`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    });
    if(deletion.data.success){
      notify.success("Successfully deleted account");
      navigate("/signup")
    }else{
      notify.error("Failed to delete account");
      console.log(deletion.data.error)
    }
  }
  return (
    <div className="allPages">
      <div className="myprofile-page">
        <h2 className="profile-heading proHead">View your profile</h2>
        {user ? (
          <div className="profile-card ">
            <img src={user.profilePic?.url} alt="Profile" className="userimg" />
            <div className="profile-info">
              <p className="proSub"><strong>Name:</strong> {user.name}</p>
              <p className="proSub"><strong>Email:</strong> {user.email}</p>
              <p className="proSub"><strong>Role:</strong> {user.role}</p>
              <p className="proSub"><strong>Models Created:</strong> {user.contributionCount}</p>
            </div>

            <div className="profile-buttons">
              <div className="profile-secondarybtns">
                {user.generatedFile?.url && (
                  <button className="profile-btn proHead">
                      <a href={user.generatedFile.url} target="_blank" rel="noreferrer">Download generated file</a>
                       <DownloadIcon sx={{fontSize:"25px"}}/>
                  </button>
                )}
                <button className="profile-btn proHead" onClick={() => navigate(`/models/mymodels`)}>
                  Explore your models <RocketLaunchIcon/>
                </button>
              </div>
              <div className="profile-mainbtns">
                <button className="profile-btn logout-btn proHead" onClick={deleteAcc}>
                  Delete Account <DeleteForeverIcon/>
                </button>
                <button className="profile-btn logout-btn proHead" onClick={logout}>
                  Log Out <LogoutIcon/>
                </button>
              </div>
              
            </div>

          </div>
        ) : (
          <h1 style={{color:"var(--text-primary)"}}>Loading your profile data.....</h1>
        )}
    </div>
    </div>
  );
};

export default MyProfile;
