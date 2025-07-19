import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import "../Styles/community.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const Community = () => {
  const [posts, setPosts] = useState([]);

  const getPostData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community`, {
        withCredentials: true,
      });
      if (res.data.fetched) {
        setPosts(res.data.posts);
      } else {
        notify.error(res.data.message);
      }
    } catch (err) {
      notify.error("Failed to load posts.");
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  return (
    <div className="allPages">
      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <div className="post-header">
            <img src={post.author?.profilePic?.url} alt="Profile" className="profile-img" />
            <div className="user-info">
              <p className="username">{post.author?.name || "Anonymous User"}</p>
              <p className="time">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="post-body">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
          </div>
          <div className="post-footer">
            <span><ThumbUpIcon fontSize="small" /> {post.likes?.length || 0}</span>
            <span><VisibilityIcon fontSize="small" /> {post.views || 0}</span>
            <span><ChatBubbleOutlineIcon fontSize="small" /> {post.comments?.length || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Community;
