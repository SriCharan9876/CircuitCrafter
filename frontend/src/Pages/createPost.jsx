import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/createPost.css";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [topics, setTopics] = useState([]);
  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [models, setModels] = useState([]);

  const [activeTag, setActiveTag] = useState(null); // which input is open
  const [inputValue, setInputValue] = useState("");

  const { token,emitPublicMessage,emitPrivateMessage,user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      notify.error("Login for creating post");
      navigate("/login");
    }
  }, []);

  const handleAddTag = async() => {
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    if(activeTag === "people" && !people.includes(value)){
      const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-exist/${value}`,{
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
      })
      if(!res.data.exist){
        notify.error("User doesn't exist");
      }else{
        setPeople([...people, res.data.user]); 
        console.log(people)
      }
    }
    if (activeTag === "post" && !posts.includes(value)){
        const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/community/check-exist/${value}`,{
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        if(!res.data.exist){
          notify.error("Post doesn't exist");
        }else{
          setPosts([...posts, res.data.post]);
        }
    }
    if (activeTag === "model" && !models.includes(value)){
        const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/check-exist/${value}`,{
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        if(!res.data.exist){
          notify.error("Model doesn't exist");
        }else{
          setModels([...models, res.data.model]); 
        }
    }
    
    if (activeTag === "topic" && !topics.includes(value)) setTopics([...topics, value]);
    setInputValue("");
    setActiveTag(null); // close after adding
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/community/create`,
        { title, content, topics, people, posts, models },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.posted) {
        const id =import.meta.env.VITE_PUBLIC_ROOM;
        people.forEach((p) => {
          emitPrivateMessage(
            user.name,
            `You are tagged in post named "${title}"`,
            id,
            p._id,
          );
        });
        models.forEach((p) => {
          emitPrivateMessage(
            user.name,
            `Your model was tagged in post named "${title}"`,
            id,
            p.createdBy,
          );
        });
        posts.forEach((p) => {
          emitPrivateMessage(
            user.name,
            `Your post was tagged in post named "${title}"`,
            id,
            p.author,
          );
        });
        notify.success(res.data.message);
      } else {
        notify.error(res.data.message);
      }
      navigate("/community");
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  return (
    <div className="allPages">
      <div className="create-post-page">
        <div className="header">
          <input
            className="title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="cancel">Cancel</button>
          <button className="post" onClick={handleSubmit}>
            Post
          </button>
        </div>

        {/* Tagging Buttons */}
        <div className="tag-buttons">
          <button onClick={() => setActiveTag("people")}>Tag People</button>
          <button onClick={() => setActiveTag("post")}>Tag Post</button>
          <button onClick={() => setActiveTag("model")}>Tag a Model</button>
          <button onClick={() => setActiveTag("topic")}>Tag a Topic</button>
        </div>

        {/* Dynamic Input Field */}
        {activeTag && (
          <div className="tag-input-wrapper">
            <input
              type="text"
              placeholder={`+ Add ${activeTag}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              autoFocus
            />
          </div>
        )}

        {/* Display Tags */}
        <div className="tag-lists">
          {people.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">People:</strong>{" "}
              {people.map((p, i) => (
                <span key={i} className="tag">{p.name}</span>
              ))}
            </div>
          )}
          {posts.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">Posts:</strong>{" "}
              {posts.map((p, i) => (
                <span key={i} className="tag">{p.title}</span>
              ))}
            </div>
          )}
          {models.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">Models:</strong>{" "}
              {models.map((m, i) => (
                <span key={i} className="tag">{m.modelName}</span>
              ))}
            </div>
          )}
          {topics.length > 0 && (
            <div className="eachTag">
              <strong className="sideTags">Topics:</strong>{" "}
              {topics.map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="editor">
          <textarea
            className="content-area"
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
