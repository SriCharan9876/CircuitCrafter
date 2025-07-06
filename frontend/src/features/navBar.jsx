import {Link,useNavigate} from "react-router-dom";
import "../Styles/navBar.css";
import { useAuth } from "../contexts/authContext";

export default function NavBar(){
  const { user } = useAuth(); // get user from context

  return(
      <div className="navBar">
        <div className="navLeft">
          <div className="navItem">
            <Link to="/models" className="logo navLink">Circuitcrafter</Link>
          </div>
          <div className="navItem">
            <Link to="/models" className="navLink">Explore</Link>
          </div>
          <div className="navItem">
            <Link to="/categories" className="navLink">Categories</Link>
          </div>
        </div>

        <div className="navRight">
          {user?(
            <>
            <div className="navItem">
              <Link to="/models/create" className="navLink">Add new model</Link>
            </div>
            <div className="navItem">
              <Link to="/notifications" className="navLink">Notifications</Link>
            </div>
            <div className="navItem">
              <Link to="/myprofile" className="navLink">My profile</Link>
            </div>
            {/* <div className="navItem"> */}
              {/* <Link to="/logout" className="navLink">Logout</Link> */}
            {/* </div> */}
            </>
          ):(
            <>
            <div className="navItem">
              <Link to="/login" className="navLink">Login</Link>
            </div>
            <div className="navItem">
              <Link to="/signup" className="navLink">Signup</Link>
            </div>
            </>
          )}

        </div>
      </div>
  )
}