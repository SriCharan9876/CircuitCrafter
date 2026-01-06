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
import HomeIcon from '@mui/icons-material/Home';

const Mentions = () => {
  const [taggedMe, setTaggedMe] = useState([]);
  const [taggedMyPost, settaggedMyPost] = useState([]);
  const [taggedMyModel, settaggedMyModel] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const getPostData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community/men`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.fetched) {
        const allPosts = res.data.posts || [];
        const myModels = res.data.models || [];
        const myModelNames = myModels.map(m => m.modelName);
        const myUserId = user?._id;
        const myName = user?.name;

        // 1. Posts where user is tagged in "people"
        const taggedInPeople = allPosts.filter(post =>
          post.people?.includes(myName)
        );

        // 2. Posts where user's own posts are tagged
        let taggedInPosts = [];
        for (let i = 0; i < allPosts.length; i++) {
          const post = allPosts[i];
          if (post.posts && post.posts.length > 0) {
            for (let j = 0; j < post.posts.length; j++) {
              const taggedPostTitle = post.posts[j];
              // find if this tagged post belongs to current user
              for (let k = 0; k < allPosts.length; k++) {
                const ap = allPosts[k];
                if (ap.title === taggedPostTitle && ap.author._id === myUserId) {
                  taggedInPosts.push(post);
                  // break inner loops once matched
                  j = post.posts.length;
                  break;
                }
              }
            }
          }
        }

        // 3. Posts where user's models are tagged
        const taggedInModels = allPosts.filter(post =>
          post.models?.length > 0 && post.models.some(m =>
            myModelNames.includes(m)
          )
        );

        setTaggedMe(taggedInPeople);
        settaggedMyPost(taggedInPosts);
        settaggedMyModel(taggedInModels);

      } else {
        notify.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      notify.error("Failed to load mentions.");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUpdate = (postsList, setPostsList, id, currentUserId) => {
    setPostsList(prevPosts =>
      prevPosts.map(post => {
        if (post._id === id) {
          const isLiked = post.likes.includes(currentUserId);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter(uid => uid !== currentUserId)
              : [...post.likes, currentUserId],
          };
        }
        return post;
      })
    );
  };

  const likeIt = async (id) => {
    if (!token) {
      notify.warning("Login to interact with posts");
      return navigate("/login");
    }

    // Optimistic Update for all lists
    handleLikeUpdate(taggedMe, setTaggedMe, id, user?._id);
    handleLikeUpdate(taggedMyPost, settaggedMyPost, id, user?._id);
    handleLikeUpdate(taggedMyModel, settaggedMyModel, id, user?._id);

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/community/${id}/like`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.data.liked) {
        notify.error(res.data.message);
        // Re-fetch to sync if failed
        getPostData();
      }
    } catch (err) {
      notify.error("Failed to update like.");
      getPostData();
    }
  }

  useEffect(() => {
    getPostData();
  }, [token]);

  const PostCard = ({ post }) => (
    <div
      className="community-post-card"
      key={post._id}
      onClick={() => navigate(`/community/${post._id}`)}
    >
      <div className="post-header-row">
        <img
          src={post.author?.profilePic?.url}
          alt="User"
          className="post-user-avatar"
        />
        <div className="post-user-meta">
          <span className="post-user-name">
            {post.author?.name || "Anonymous User"}
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
        {post.content.length > 200
          ? post.content.substring(0, 200) + "..."
          : post.content}
      </p>

      <div className="post-actions-row">
        <button
          className={`action-btn ${post.likes?.includes(user?._id) ? "liked" : ""}`}
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
  );

  const SkeletonCard = () => (
    <div className="skeleton-card">
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
  );

  return (
    <div className="community-page-container">
      <div className="community-content-wrapper">

        {/* FEED SECTION */}
        <div className="community-feed-section">

          {/* Section: Tagged User */}
          <h2 className="widget-title" style={{ marginTop: 0 }}>Mentions</h2>
          {loading ? (
            <SkeletonCard />
          ) : taggedMe.length === 0 ? (
            <div className="no-posts-state" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <p>No posts found where you were mentioned.</p>
            </div>
          ) : (
            taggedMe.map(post => <PostCard post={post} key={post._id} />)
          )}

          {/* Section: Tagged Posts */}
          <h2 className="widget-title" style={{ marginTop: '2rem' }}>Tagged Posts</h2>
          {loading ? (
            <SkeletonCard />
          ) : taggedMyPost.length === 0 ? (
            <div className="no-posts-state" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <p>No posts found where your posts were referenced.</p>
            </div>
          ) : (
            taggedMyPost.map(post => <PostCard post={post} key={post._id} />)
          )}

          {/* Section: Tagged Models */}
          <h2 className="widget-title" style={{ marginTop: '2rem' }}>Tagged Models</h2>
          {loading ? (
            <SkeletonCard />
          ) : taggedMyModel.length === 0 ? (
            <div className="no-posts-state" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <p>No posts found where your models were referenced.</p>
            </div>
          ) : (
            taggedMyModel.map(post => <PostCard post={post} key={post._id} />)
          )}

        </div>

        {/* SIDEBAR SECTION */}
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
              onClick={() => navigate("/community")}
            >
              <HomeIcon /> Community Feed
            </button>
          </div>

          <div className="sidebar-widget info-widget">
            <h4 className="widget-title">About Mentions</h4>
            <p>
              Stay updated! Here you can see who mentioned you, referenced your posts,
              or linked to your models in their discussions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Mentions;