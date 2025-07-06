import { Link } from "react-router-dom";
import "../Styles/sideBar.css";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion"; // Models
import AddBoxIcon from "@mui/icons-material/AddBox"; // New Model
import CategoryIcon from "@mui/icons-material/Category"; // Categories
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder"; // New Category
import InventoryIcon from "@mui/icons-material/Inventory"; // My Models
import MenuIcon from "@mui/icons-material/Menu";
import ContactPageIcon from "@mui/icons-material/ContactPage"; // Contact
import FavoriteIcon from '@mui/icons-material/Favorite';        // filled heart
import { useNavigate } from "react-router-dom";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const token=localStorage.getItem("token");
  const [userData,setUserData]=useState({});
  const navigate=useNavigate();
  useEffect(()=>{
        const check_login=()=>{
            if(token){
                try{
                    const user=jwtDecode(token);
                    console.log(user);
                    setUserData(user);
                }catch(err){
                    console.log(err);
                }
            }
        }
        check_login();
    },[])
  return (
    <div className={`sideBar ${isOpen ? "open" : "closed"}`}>
      <div className="inside">
        <div className="nav-item close-btn">
          {isOpen?( 
              <button onClick={toggleSidebar} id="close-button">
                <CloseIcon style={{ fontSize: "1.5rem", color: "white" }} />
              </button>):(
                <button onClick={toggleSidebar} id="close-button">
                  <MenuIcon style={{ fontSize: "1.5rem", color: "white" }} />
                </button>
              )
          }
          
        </div>

        <div className="nav-item">
          <Link to="/models" className="nav-link">
            <AutoAwesomeMotionIcon className="icon" /> Models
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/models/create" className="nav-link">
            <AddBoxIcon className="icon" /> New Model
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/categories" className="nav-link">
            <CategoryIcon className="icon" /> Categories
          </Link>
        </div>

        {userData.role=="admin" && 
          <div className="nav-item">
            <Link to="/categories/create" className="nav-link">
              <CreateNewFolderIcon className="icon" /> New Category
            </Link>
          </div>
        }

        <div className="nav-item">
          <Link to="/models/mymodels" className="nav-link">
            <InventoryIcon className="icon" /> My Models
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/" className="nav-link">
            <FavoriteIcon className="icon" /> Favorite Models
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/contact" className="nav-link">
            <ContactPageIcon className="icon" /> Contact
          </Link>
        </div>
        {userData.role=="admin" && 
          <div className="nav-item">
              <Link to="/models/pending" className="nav-link">
                <HourglassBottomIcon className="icon" /> Pending Models
              </Link>
          </div>
        }
      </div>
      {isOpen &&<hr style={{width:"12rem"}}/>}
    </div>
  );
}
