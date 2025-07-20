import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../features/toastManager";
import { useAuth } from "../contexts/authContext";
import "../Styles/eachPost.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from '@mui/icons-material/Share';
const PostDetail = () => {
  const { id } = useParams();
  const [post, setPosts] = useState({});
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, token } = useAuth();

  const getPost = async () => {
    try {
      console.log("Fetching post...");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community/${id}`, {
        withCredentials: true,
      });
      if (res.data.fetched) {
        setPosts(res.data.posts);
        console.log(res.data.posts);
      } else {
        notify.error(res.data.message);
      }
    } catch (err) {
      notify.error("Failed to load post.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        notify.error("Share canceled or failed.");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      notify.success("Link copied to clipboard!");
    }
  };

  const onLike = async (id) => {
    if (!isLoggedIn) return navigate("/login");
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/community/${id}/like`, {}, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.liked) {
      notify.success(res.data.message);
      getPost();
    } else {
      notify.error(res.data.message);
    }
  };

  useEffect(() => {
    console.log("PostDetail mounted");
    getPost();
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="allPages2">
      <div className="post-header">
        <img
          className="avatar"
          src={post.author?.profilePic?.url}
          alt="Avatar"
        />
        <div>
          <h3>{post.author?.name || "Anonymous User"}</h3>
          <p className="date">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="post-content2">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button onClick={() => onLike(post._id)}>
          <ThumbUpIcon/> {post.likes?.length || 0}
        </button>
        <button disabled>
          <VisibilityIcon/> {post.views || 0}
        </button>
        <button disabled>
          <ChatBubbleOutlineIcon/> {post.comments?.length || 0}
        </button>
        <button onClick={handleShare}>
           <ShareIcon/>
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
