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

import { useAuth } from "../contexts/authContext"; // 👈 get from context

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useAuth();

  const commonLinks = [
    { to: "/models", label: "Models", icon: <AutoAwesomeMotionIcon /> },
    { to: "/models/create", label: "New Model", icon: <AddBoxIcon /> },
    { to: "/categories", label: "Categories", icon: <CategoryIcon /> },
    { to: "/models/mymodels", label: "My Models", icon: <InventoryIcon /> },
    { to: "/", label: "Favorite Models", icon: <FavoriteIcon /> },
    { to: "/contact", label: "Contact", icon: <ContactPageIcon /> },
  ];

  const adminLinks = [
    { to: "/categories/create", label: "New Category", icon: <CreateNewFolderIcon /> },
    { to: "/models/pending", label: "Pending Models", icon: <HourglassBottomIcon /> },
  ];


  return (
    <div className={`sideBar ${isOpen ? "open" : "closed"}`}>
      <div className="inside">

        <div className=" close-btn">
          {isOpen?( 
            <>
            {/*Logo object from navbar: */}
            <div className="navItem">
              <Link to="/models" className="logo navLink">Circuitcrafter</Link>
            </div>

            <button onClick={toggleSidebar} id="close-button">
              <CloseIcon style={{ fontSize: "1.5rem", color: "white" }} />
            </button>
            </>
              ):(
                <button onClick={toggleSidebar} id="close-button">
                  <MenuIcon style={{ fontSize: "1.5rem", color: "white" }} />
                </button>
              )
          }
        </div>

        {/* Everyone access links: */}
        
        {commonLinks.map(({ to, label, icon }, idx) => (
          <div key={idx} className="nav-item"  title={label}>
            <Link to={to} className="nav-link">
              {icon} {isOpen && label}
            </Link>
          </div>
        ))}

        {/* Admin only access links: */}

        {user?.role === "admin" &&
          adminLinks.map(({ to, label, icon }, idx) => (
            <div key={`admin-${idx}`} className="nav-item"  title={label}>
              <Link to={to} className="nav-link">
                {icon} {isOpen && label}
              </Link>
            </div>
        ))}

      </div>

      {isOpen &&<hr style={{width:"12rem"}}/>}
    </div>
  );
}
