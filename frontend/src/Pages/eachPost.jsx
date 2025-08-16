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
import SendIcon from "@mui/icons-material/Send";
const PostDetail = () => {
  const { id } = useParams();
  const [post, setPosts] = useState({});
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, token } = useAuth();
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) return navigate("/login");
    if (!commentText.trim()) return notify.error("Comment cannot be empty.");

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/community/${id}/addComment`,
        { comment: commentText },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.success) {
        notify.success("Comment added!");
        setCommentText("");
        getPost();
      } else {
        notify.error(res.data.message || "Failed to add comment.");
      }
    } catch (err) {
      notify.error("Error adding comment.");
    }
  };


  const getPost = async () => {
    try {
      // console.log("token:",token)
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community/${id}`
        // withCredentials: true,
        // headers: token ? { Authorization: `Bearer ${token}` } : {}
    );
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
    <div className="allPages">
    <div className="post-view-page">
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

        {/* Tags Section */}
        <div className="tag-lists" id="tl2">
          <h2 className="taghead">Tagged:</h2>
          {post.people?.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">People:</strong>
              {post.people.map((p, i) => (
                <span key={i} className="tag">{p}</span>
              ))}
            </div>
          )}

          {post.posts?.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">Posts:</strong>
              {post.posts.map((p, i) => (
                <span key={i} className="tag">{p}</span>
              ))}
            </div>
          )}

          {post.models?.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">Models:</strong>
              {post.models.map((m, i) => (
                <span key={i} className="tag">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>
        

      <div className="post-actions">
        <button onClick={() => onLike(post._id)} style={{ color: token && post.likes?.includes(user?._id) ? "red" : "inherit" }}>
          <ThumbUpIcon/> {post.likes?.length || 0}
        </button>
        <button>
          <VisibilityIcon/> {post.views?.length || 0}
        </button>
        <button>
          <ChatBubbleOutlineIcon/> {post.comments?.length || 0}
        </button>
        <button onClick={handleShare}>
           <ShareIcon/>
        </button>
      </div>
      <div className="comment-section">
        <div className="comment-input-box">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>
            <SendIcon />
          </button>
        </div>

        <div className="comments-list">
          {post.comments?.length > 0 ? (
            post.comments.map((comment, index) => (
              <div className="comment-card" key={index}>
                <strong>{comment.user?.name || "Anonymous"}:</strong>
                <p>{comment.text}</p>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
  </div>
  </div>
  );
};

export default PostDetail;
