import {Link,useNavigate} from "react-router-dom";
import "../Styles/biolerplate.css";
import { useState,useEffect } from "react";
import axios from "axios";
export default function Sidebar(){
    const navigate=useNavigate();
    const [isLogged,setisLogged]=useState(false);
    const [userData,setuserData]=useState({});
    useEffect(()=>{
        const checkAuth=async()=>{
            const token=localStorage.getItem("token");
            if (!token) {
                setisLogged(false);
                setflashMessage("No token found. Please log in.");
                setistype("error");
                return;
            }
            try{
                const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/me`,{
                    withCredentials:true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.isLoggedIn) {
                  setisLogged(true);
                  setuserData(res.data.user);
                } else {
                  setisLogged(false);
                }
            }catch(err){
                console.error("Auth check failed", err);
                setisLogged(false);
            }
            return;
        }
        checkAuth();
    },[isLogged])
    const hhome=()=>{
        // navigate("/home")
    }
    const hnewexam=()=>{
        // navigate("/create-exam");
    }
    const groups=()=>{
        // navigate("/groups")
    }
    const hprofile=()=>{
        // navigate("/profile")
    }
    const signup=()=>{
        // navigate("/signUp");
    }
    const logins=()=>{
        // navigate("/login");
    }
    const settings=()=>{
    //   navigate("/settings");
    }
    
    return(
        <>
        <div className="head">
        {isLogged ? (
            <div className='head2'>
              <h2>Welcome, {userData.username}!</h2>
            </div>
          ) : (
            <div className='sl'>
              <div className='log' onClick={signup}>Signup/</div>
              <div className='log' onClick={logins}>Login</div>
            </div>
          )}
      </div>
        <div className="sidebar">
                <div className="icon" onClick={hhome}>
                    <div className="ic"><img src="/icon.png" alt="icon" className="icon2"/></div>
                    <div id="txt"><h3 id="txt2">CircuitCrafter</h3></div>
                </div>
                <div className="home" onClick={hhome}>
                  <div className="icones"></div>
                  <div className="labeles">
                    <h4>Home</h4>
                  </div>
                </div>

                <div className="newexam" onClick={hnewexam}>
                  <div className="icones"></div>
                  <div className="labeles">
                    <h4>New Exam</h4>
                  </div>
                </div>

                <div className="newtask" onClick={groups}>
                  <div className="icones"></div>
                  <div className="labeles">
                    <h4>Groups</h4>
                  </div>
                </div>

                <div className="profile" onClick={hprofile}>
                  <div className="icones"></div>
                  <div className="labeles">
                    <h4>Profile</h4>
                  </div>
                </div>

                <div className="settings" onClick={settings}>
                  <div className="icones"></div>
                  <div className="labeles">
                    <h4>Settings</h4>
                  </div>
                </div>
            {/* </div> */}
                
                
        </div>
        </>
    );
}