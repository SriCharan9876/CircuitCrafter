import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import { useNavigate } from "react-router-dom";
import "../Styles/community.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useAuth } from "../contexts/authContext";

const Mentions = () => {
  const [taggedMe,setTaggedMe]=useState([]);
  const [taggedMyPost,settaggedMyPost]=useState([]);
  const [taggedMyModel,settaggedMyModel]=useState([]);
  const [isLogggedIn,setIsLoggedIn]=useState(false);
  const { user, token } = useAuth(); // use context
  const navigate=useNavigate();
  const getPostData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (res.data.fetched) {
        const allPosts = res.data.posts || [];
        const myModels = res.data.models || []; // models created by logged-in user
        const myModelNames = myModels.map(m => m.modelName);
        const myUserId = user?._id;   // logged-in user's id
        const myName = user?.name;    // logged-in user's name
      
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
            console.log("taggedtitle:",taggedPostTitle)
              // find if this tagged post belongs to current user
              for (let k = 0; k < allPosts.length; k++) {
                const ap = allPosts[k];
                console.log("amma:",ap)
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
        
        // console.log("tagged: ",taggedInPosts)
        // console.log(myUserId)
      
        // 3. Posts where user's models are tagged
        console.log(myModelNames)

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
      notify.error("Failed to load posts.");
    }
  };
  
  const likeIt=async(id)=>{

    if(!isLogggedIn) {
      notify.warning("Login to interact with posts");
      navigate("/login");
    }
    const res=await axios.put(`${import.meta.env.VITE_API_BASE_URL}/community/${id}/like`,{} ,{
      withCredentials: true,
      headers:{Authorization:`Bearer ${token}`}
    });
    if(res.data.liked){
      notify.success(res.data.message);
      getPostData();
    }else{
      notify.error(res.data.message);
    }
  }
  useEffect(() => {
    getPostData();
    if(token){
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="allPages" id="community-wrapper">

  {/* Tagged Me Section */}
  <h2 className="menHead">Mentions</h2>
  {/* <hr /> */}
  {taggedMe.length === 0 ? (
    <p>No posts found where you were mentioned.</p>
  ) : (
    taggedMe.map((post) => (
      <>
        <div className="post-card" key={post._id} onClick={() => navigate(`/community/${post._id}`)}>
          <div className="post-header">
            <img src={post.author?.profilePic?.url} alt="Profile" className="profile-img" />
            <div className="user-info">
              <p className="username">{post.author?.name || "Anonymous User"}</p>
              <p className="time">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="post-body">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">
              {post.content.split(" ").slice(0, 70).join(" ")}
              {post.content.split(" ").length > 30 && "..."}
            </p>
          </div>
          <div className="post-footer">
            <span
              onClick={(e) => {
                e.stopPropagation();
                likeIt(post._id);
              }}
              style={{
                color: token && post.likes?.includes(user?._id) ? "red" : "inherit",
              }}
            >
              <ThumbUpIcon fontSize="small" /> {post.likes?.length || 0}
            </span>
            <span><VisibilityIcon fontSize="small" /> {post.views?.length || 0}</span>
            <span><ChatBubbleOutlineIcon fontSize="small" /> {post.comments?.length || 0}</span>
          </div>
        </div>
      </>
    ))
  )}

  {/* Tagged My Posts Section */}
  <h2 className="menHead">Tagged Posts</h2>
  {taggedMyPost.length === 0 ? (
    <p>No posts found where your posts were tagged.</p>
  ) : (
    taggedMyPost.map((post) => (
      <>
        <div className="post-card" key={post._id} onClick={() => navigate(`${post._id}`)}>
          <div className="post-header">
            <img src={post.author?.profilePic?.url} alt="Profile" className="profile-img" />
            <div className="user-info">
              <p className="username">{post.author?.name || "Anonymous User"}</p>
              <p className="time">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="post-body">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">
              {post.content.split(" ").slice(0, 70).join(" ")}
              {post.content.split(" ").length > 30 && "..."}
            </p>
          </div>
          <div className="post-footer">
            <span
              onClick={(e) => {
                e.stopPropagation();
                likeIt(post._id);
              }}
              style={{
                color: token && post.likes?.includes(user?._id) ? "red" : "inherit",
              }}
            >
              <ThumbUpIcon fontSize="small" /> {post.likes?.length || 0}
            </span>
            <span><VisibilityIcon fontSize="small" /> {post.views?.length || 0}</span>
            <span><ChatBubbleOutlineIcon fontSize="small" /> {post.comments?.length || 0}</span>
          </div>
        </div>
      </>
    ))
  )}

  {/* Tagged My Models Section */}
  <h2 className="menHead">Tagged Models</h2>
  {taggedMyModel.length === 0 ? (
    <p>No posts found where your models were tagged.</p>
  ) : (
    taggedMyModel.map((post) => (
      <>
        <div className="post-card" key={post._id} onClick={() => navigate(`${post._id}`)}>
          <div className="post-header">
            <img src={post.author?.profilePic?.url} alt="Profile" className="profile-img" />
            <div className="user-info">
              <p className="username">{post.author?.name || "Anonymous User"}</p>
              <p className="time">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="post-body">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">
              {post.content.split(" ").slice(0, 70).join(" ")}
              {post.content.split(" ").length > 30 && "..."}
            </p>
          </div>
          <div className="post-footer">
            <span
              onClick={(e) => {
                e.stopPropagation();
                likeIt(post._id);
              }}
              style={{
                color: token && post.likes?.includes(user?._id) ? "red" : "inherit",
              }}
            >
              <ThumbUpIcon fontSize="small" /> {post.likes?.length || 0}
            </span>
            <span><VisibilityIcon fontSize="small" /> {post.views?.length || 0}</span>
            <span><ChatBubbleOutlineIcon fontSize="small" /> {post.comments?.length || 0}</span>
          </div>
        </div>
      </>
    ))
  )}

</div>

  );
};

export default Mentions;