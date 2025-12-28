import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { notify } from "../features/toastManager";
import { useAuth } from "../contexts/authContext";
import "../Styles/notifications.css"
import axios from "axios";
import ClearIcon from '@mui/icons-material/Clear';

const Notification = () => {
  const { token, user, loadingUser, numNot, setNumNot, allNotifications, setNotifications, emitPublicMessage, emitPrivateMessage } = useAuth();
  const [newMsg, setnewMsg] = useState("");
  useEffect(() => {
    getNotifications();
  }, [])

  const handlePublicSubmit = async (event) => {
    event.preventDefault();
    let username = user.name;
    let id = import.meta.env.VITE_PUBLIC_ROOM;
    let id2 = "686293bb86e54745cc8913c8"
    emitPrivateMessage("private", "saiamma", id, id2)
    setnewMsg("");
  };
  const getNotifications = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/notifications`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.data.success) {
      setNotifications(res.data.notifications);
      setNumNot(res.data.notifications.length);
    } else {
      notify.error("Failed to fetch notifications");
    }
  }

  const closeNoti = async (noteId) => {
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/auth/notifications`, { noteId }, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.data.success) {
      getNotifications();
    } else {
      notify.error("failed to remove")
    }
  }
  const clearAll = async () => {
    for (let noti of allNotifications) {
      closeNoti(noti._id);
    }
  }

  return (
    <div className="allPages">
      <div className="notifications-page">
        {/* Header */}
        <h1 className="notification-header">Notifications <button className="clearAll" onClick={() => clearAll()}>Clear All</button></h1>

        {/* Notifications list */}
        <div className="notification-list">
          {allNotifications.length === 0 ? (
            <div className="no-notifications">No notifications yet</div>
          ) : (
            allNotifications.map((note, idx) => (
              <div className="eachNote">

                <div
                  key={idx}
                  className="notification-item"
                >
                  <div className="notification-sender">{note.sender}</div>
                  <div className="notification-message">{note.message}</div>
                  <div className="notification-time">
                    {(() => {
                      const date = new Date(note.time);
                      const today = new Date();

                      const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();

                      return isToday
                        ? date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : date.toLocaleDateString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });
                    })()}
                  </div>

                </div>
                <div className="clear" onClick={() => closeNoti(note._id)}>
                  <ClearIcon sx={{ fontSize: 32 }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
