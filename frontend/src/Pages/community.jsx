import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import { useNavigate } from "react-router-dom";
import "../Styles/community.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useAuth } from "../contexts/authContext";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AddIcon from '@mui/icons-material/Add';
const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth(); // use context
  const navigate = useNavigate();
  const getPostData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.fetched) {
        setPosts(res.data.posts);
      } else {
        notify.error(res.data.message);
      }
    } catch (err) {
      notify.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };
  const likeIt = async (id) => {
    if (!token) {
      notify.warning("Login to interact with posts");
      return navigate("/login");
    }

    // Optimistic Update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === id) {
          const isLiked = post.likes.includes(user?._id);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((uid) => uid !== user?._id)
              : [...post.likes, user?._id],
          };
        }
        return post;
      })
    );

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/community/${id}/like`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.liked) {
        notify.error(res.data.message);
        getPostData(); // Revert/Sync if failed
      }
    } catch (err) {
      notify.error("Failed to update like.");
      getPostData(); // Revert/Sync if failed
    }
  };

  useEffect(() => {
    getPostData();
  }, [token]);

  return (
    <div className="community-page-container">
      <div className="community-content-wrapper">

        {/* CENTER FEED */}
        <div className="community-feed-section">
          {loading ? (
            // Skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div className="skeleton-card" key={index}>
                <div className="sk-header">
                  <div className="sk-avatar"></div>
                  <div className="sk-lines">
                    <div className="sk-line long"></div>
                    <div className="sk-line short"></div>
                  </div>
                </div>
                <div className="sk-body"></div>
                <div className="sk-body"></div>
              </div>
            ))
          ) : posts.length > 0 ? (
            [...posts]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <div
                  className="community-post-card"
                  key={post._id}
                  onClick={() => navigate(`${post._id}`)}
                >
                  <div className="post-header-row">
                    <img
                      src={post.author?.profilePic?.url}
                      alt="User"
                      className="post-user-avatar"
                    />
                    <div className="post-user-meta">
                      <span className="post-user-name">
                        {post.author?.name || "Anonymous"}
                      </span>
                      <span className="post-timestamp">
                        {new Date(post.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  <h3 className="post-main-title">{post.title}</h3>

                  <p className="post-excerpt">
                    {post.content.length > 180
                      ? post.content.substring(0, 180) + "..."
                      : post.content}
                  </p>

                  <div className="post-actions-row">
                    <button
                      className={`action-btn ${post.likes?.includes(user?._id) ? "liked" : ""
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        likeIt(post._id);
                      }}
                    >
                      <ThumbUpIcon fontSize="small" />
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    <button className="action-btn">
                      <VisibilityIcon fontSize="small" />
                      <span>{post.views?.length || 0}</span>
                    </button>

                    <button className="action-btn">
                      <ChatBubbleOutlineIcon fontSize="small" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="no-posts-state">
              <h3>Community is quiet</h3>
              <p>Be the first to ignite the conversation!</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="community-sidebar-section">

          <div className="sidebar-widget action-widget">
            <h4 className="widget-title">Quick Actions</h4>
            <button
              className="primary-action-btn"
              onClick={() => navigate("/community/createPost")}
            >
              <AddIcon /> Create Post
            </button>
            <button
              className="secondary-action-btn"
              onClick={() => navigate("/community/mentions")}
            >
              <AlternateEmailIcon /> Mentions
            </button>
          </div>

          <div className="sidebar-widget info-widget">
            <h4 className="widget-title">About CircuitCrafter</h4>
            <p>
              Join a growing community of makers, engineers, and hobbyists. Share
              your circuits, ask for help, and showcase your builds.
            </p>
            {/* Add more stats here if needed */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Community;
