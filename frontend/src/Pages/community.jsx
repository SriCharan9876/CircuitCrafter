import { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import { useNavigate } from "react-router-dom";
import "../Styles/community.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useAuth } from "../contexts/authContext";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [isLogggedIn,setIsLoggedIn]=useState(false);
  const { user, token } = useAuth(); // use context
  const navigate=useNavigate();
  const getPostData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community`, {
        withCredentials: true,
        headers:{Authorization:`Bearer ${token}`}
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
  const likeIt=async(id)=>{

    if(!isLogggedIn) navigate("/login");
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
      {posts.map((post) => (<>
        <div className="post-card" key={post._id} onClick={()=>navigate(`${post._id}`)}>
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
              {post.content.split(" ").slice(0, 70).join(" ")}{post.content.split(" ").length > 30 && "..."}
            </p>
            {/* <p className="post-content">{post.content}</p> */}
          </div>
          <div className="post-footer">
            <span onClick={(e) => {e.stopPropagation();  likeIt(post._id);}} style={{ color: token && post.likes?.includes(user?._id) ? "red" : "inherit" }}><ThumbUpIcon fontSize="small"/> {post.likes?.length || 0}</span>
            <span><VisibilityIcon fontSize="small" /> {post.views?.length || 0}</span>
            <span><ChatBubbleOutlineIcon fontSize="small" /> {post.comments?.length || 0}</span>
          </div>
        </div>
        <hr/>
        </>
      ))}
    </div>
  );
};

export default Community;
