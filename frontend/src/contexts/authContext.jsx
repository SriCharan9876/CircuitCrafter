import { createContext, useContext, useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { io } from "socket.io-client";


// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Full user object
  const [loadingUser, setLoadingUser] = useState(true); // NEW
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [allNotifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const [numNot,setNumNot]=useState(0);
  const initializeUser = async () => {
    setLoadingUser(true);
    try {
      // Optional: Validate token expiration (based on jwtDecode)
      const decoded = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        // Token expired
        logout();
        return;
      }

      // Fetch full user profile from backend
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.fetched) {
        setUser(res.data.me); // Store full DB user
        setNumNot(res.data.me.notifications.length)
      } else {
        logout();
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      logout();
    }finally{
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (!token){
      setLoadingUser(false);
      return;
    }
    initializeUser();
  }, [token]);
  useEffect(() => {
  if (!token || !user) return;

  socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
    withCredentials: true,
    auth: { userId: user._id },
  });

  socketRef.current.on("connect", () => {
    console.log("✅ Socket connected:", socketRef.current.id);

    // Join public room immediately after connect
    socketRef.current.emit("join-public-room", {
      roomId: import.meta.env.VITE_PUBLIC_ROOM,
    });

    // 🔥 Now safe to emit a test message
    // socketRef.current.emit("public-message", {
    //   username: "navs",
    //   newMsg: "hello world",
    //   id: import.meta.env.VITE_PUBLIC_ROOM,
    // });
  });

  socketRef.current.on("public-message", ({ username, newMsg, id }) => {
    const newtxt = { sender: username, message: newMsg, roomId: id, time: Date.now() };
    setNotifications(prev => [...prev, newtxt]);
  });
  socketRef.current.on("private-message", ({ username, newMsg, id,receiverId }) => {
    if(receiverId==user._id){
      const newtxt = { sender: username, message: newMsg, roomId: id, time: Date.now() };
      setNotifications(prev => [...prev, newtxt]);
    }
  });

  return () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  };
}, [user, token]);

  const login = async (token, userDataFromBackend = null) => {
    localStorage.setItem("token", token);
    if (userDataFromBackend) {
      setUser(userDataFromBackend);
    } else {
      // fallback: fetch user
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (res.data.fetched){ 
          setUser(res.data.me);
          getNotifications();
        }
      } catch (err) {
        console.error("Error fetching user after login:", err);
      }
    }
  };
  const emitPublicMessage = (username, newMsg, id) => {
    if (socketRef.current) {
      socketRef.current.emit("public-message", { username, newMsg, id });
      const newtxt = {
        sender: username,
        message: newMsg,
        roomId: id,
        time: Date.now(),
      };
      savePublicNoti(newtxt);
    } else {
      console.error("Socket is not connected yet!");
    }
  };
  const emitPrivateMessage = (username, newMsg, id,receiverId) => {
    if (socketRef.current) {
      socketRef.current.emit("private-message", { username, newMsg, id,receiverId });
      const newtxt = {
        sender: username,
        receiverId:receiverId,
        message: newMsg,
        roomId: id,
        time: Date.now(),
      };
      savePrivateNoti(newtxt);
    } else {
      console.error("Socket is not connected yet!");
    }
  };
  const savePublicNoti = async (notifi) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/notifications`,
        { notifi },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    
      if (res.data.posted) {
        console.log("Notification saved:", notifi);
        getNotifications();
      } else {
        console.warn("Notification save failed:", res.data);
      }
    } catch (err) {
      console.error("Error saving notification:", err);
    }
  };

  const savePrivateNoti = async (notifi) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/notifications`,
        { notifi },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    
      if (res.data.posted) {
        console.log("Notification saved:", notifi);
        getNotifications();
      } else {
        console.warn("Notification save failed:", res.data);
      }
    } catch (err) {
      console.error("Error saving notification:", err);
    }
  };

  const getNotifications=async()=>{
    const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/notifications`,{
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    if(res.data.success){
      setNotifications(res.data.notifications);
      setNumNot(res.data.notifications.length);
      console.log(res.data.notifications);
    }else{
      notify.error("Failed to fetch notifications");
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/models");
  };

  return (
    <AuthContext.Provider value={{ user, token, loadingUser,numNot,setUser,login, logout,initializeUser,setNumNot,allNotifications,setNotifications,emitPublicMessage,emitPrivateMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use context
export const useAuth = () => useContext(AuthContext);