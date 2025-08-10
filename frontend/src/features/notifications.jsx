import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { notify } from "../features/toastManager";
import { useAuth } from "../contexts/authContext";
import "../Styles/notifications.css"
import axios from "axios";

const Notification = () => {
  const socketRef = useRef(null);
  const { token, user,loadingUser } = useAuth();
  const [allNotifications, setNotifications] = useState([]);
  const [newMsg, setnewMsg] = useState("");
  useEffect(()=>{
    getNotifications();
  },[])
  useEffect(() => {
    if(loadingUser) return;
    if (!token || !user) {
      notify.error("Login or signUp to receive notifications");
      return;
    }
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
      auth: { userId: user._id },
      withCredentials: true,
    });

    socketRef.current.emit("join-public-room", {
      roomId: import.meta.env.VITE_PUBLIC_ROOM,
    });

    socketRef.current.on("public-message", ({ username, newMsg, id }) => {
      const newtxt = {
        sender: username,
        message: newMsg,
        roomId: id,
        time: Date.now(),
      };
      setNotifications((prev) => [...prev, newtxt]);
    });

    socketRef.current.on("private-message", ({ username, newMsg, id }) => {
      const newtxt = {
        sender: username,
        message: newMsg,
        roomId: id,
        time: Date.now(),
      };
      setNotifications((prev) => [...prev, newtxt]);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user,token]);

  const handlePublicSubmit = async (event) => {
    event.preventDefault();
    let username = user.name;
    if (!socketRef.current || newMsg.trim() === "") return;
    let id = import.meta.env.VITE_PUBLIC_ROOM;
    console.log(newMsg+" "+id+" "+username);
    socketRef.current.emit("public-message", { username, newMsg, id });
    const newtxt = {
      sender: username,
      message: newMsg,
      roomId: id,
      time: Date.now(),
    };
    saveNoti(newtxt);
    setnewMsg("");

  };
  const saveNoti = async (notifi) => {
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
      console.log(res.data.notifications);
    }else{
      notify.error("Failed to fetch notifications");
    }
  }

  return (
    <div className="allPages" id="notification-container">
      {/* Header */}
      <h1 className="notification-header">Notifications</h1>

      {/* Notifications list */}
      <div className="notification-list">
        {allNotifications.length === 0 ? (
          <div className="no-notifications">No notifications yet</div>
        ) : (
          allNotifications.map((note, idx) => (
            <div
              key={idx}
              className="notification-item"
            >
              <div className="notification-sender">{note.sender}</div>
              <div className="notification-message">{note.message}</div>
              <div className="notification-time">
                {new Date(note.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Debug message input */}
      <form className="notification-form" onSubmit={handlePublicSubmit}>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setnewMsg(e.target.value)}
          placeholder="Type debug message..."
          className="notification-input"
        />
        <button type="submit" className="notification-send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default Notification;
