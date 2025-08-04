import {Link} from "react-router-dom";
import "../Styles/navBar.css";
import { useAuth } from "../contexts/authContext";
import { useTheme } from "../contexts/themeContext";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar({toggleSidebar}){
  const { user } = useAuth(); // get user from context
  const { theme, toggleTheme } = useTheme();

  return(
      <div className="navBar">
        <div className="navLeft">

          <div>
            <button onClick={toggleSidebar} className="mobile-sidebar-toggle" id="close-button" title="open sidebar" > 
              <MenuIcon style={{ fontSize: "3rem", color:"#3a6df0"}} />
            </button>{/*This is visible only for small screens*/} 
          </div>

          <div className="navItem">
            <Link to="/models" >
              <div className="logo-icon" title="CircuitCrafter"><img src="cc_logo_img.png" alt="logo" width="70px" height="70px"/></div>
            </Link>
          </div>
          <div className="navItem">
            <Link to="/models" className="navLink">Explore</Link>
          </div>
          <div className="navItem mobile-collapse">
            <Link to="/categories" className="navLink">Categories</Link>
          </div>
        </div>

        <div className="navRight">
          <div className="navItem mobile-collapse">
            <button onClick={toggleTheme} className="navLink" >
              {theme === "dark-theme" ?  <WbSunnyOutlinedIcon sx={{fontSize:"30px"}}/>: <DarkModeOutlinedIcon sx={{fontSize:"30px"}}/>}
            </button>
          </div>

          {user?(
            <>
            <div className="navItem">
              <Link to="/notifications" className="navLink"><NotificationsNoneOutlinedIcon sx={{fontSize:"30px"}}/></Link>
            </div>
            <div className="navItem">
              <Link to="/myprofile" ><img src={user.profilePic?.url} alt="dp" className="model-owner-preview" style={{border: "2px solid var(--primary-blue)"}}/></Link>
            </div>
            </>
          ):(
            <>
            <div className="navItem">
              <Link to="/login" className="navLink">Login</Link>
            </div>
            <div className="navItem mobile-collapse">
              <Link to="/signup" className="navLink">Signup</Link>
            </div>
            </>
          )}

        </div>
      </div>
  )
}