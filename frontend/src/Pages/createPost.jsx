import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/createPost.css"
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
        notify.error("Login for creating post")
        navigate("/login")
    }
  },[])
  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleSubmit = async () => {
    try {
      const res= await axios.post(`${import.meta.env.VITE_API_BASE_URL}/community/create`,{title,content,topics},{
        withCredentials:true,
        headers:{
            Authorization: `Bearer ${token}`
        }
      });
      if(res.data.posted){
        notify.success(res.data.message);
      }else{
        notify.error(res.data.message);
      }
      navigate("/community");
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  return (
    <div className="create-post">
      <div className="header">
        <input
          className="title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="cancel">Cancel</button>
        <button className="post" onClick={handleSubmit}>Post</button>
      </div>

      <div className="topic-section">
        <input
          type="text"
          placeholder="+ Topic"
          className="topic-input"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
        />
        <div className="topic-list">
          {topics.map((topic, index) => (
            <span key={index} className="topic-tag">{topic}</span>
          ))}
        </div>
      </div>

      <div className="editor">
        <textarea
          className="content-area"
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreatePost;
