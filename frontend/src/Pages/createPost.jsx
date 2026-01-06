import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/createPost.css";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";

// Icons
import PersonIcon from '@mui/icons-material/Person';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TagIcon from '@mui/icons-material/Tag';
import CloseIcon from '@mui/icons-material/Close';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [topics, setTopics] = useState([]);
  const [people, setPeople] = useState([]);
  const [models, setModels] = useState([]);

  // Search/Dropdown state
  const [activeTag, setActiveTag] = useState(null); // 'people' | 'model' | 'topic'
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, emitPublicMessage, emitPrivateMessage, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      notify.error("Login for creating post");
      navigate("/login");
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!inputValue.trim() || !activeTag) {
        setSearchResults([]);
        return;
      }
      // Topic is just simple chip addition, no search needed (or could search topics later)
      if (activeTag === 'topic') return;

      setLoading(true);
      try {
        if (activeTag === 'people') {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/search?query=${inputValue}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSearchResults(res.data.users || []);
        } else if (activeTag === 'model') {
          // Using existing index route with search param we added
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models?search=${inputValue}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSearchResults(res.data.allModels || []);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, activeTag, token]);

  const handleAddTopic = () => {
    if (activeTag !== 'topic' || !inputValue.trim()) return;
    if (!topics.includes(inputValue.trim())) {
      setTopics([...topics, inputValue.trim()]);
    }
    setInputValue("");
  };

  const handleSelectUser = (userToAdd) => {
    if (people.some(p => p._id === userToAdd._id)) {
      setInputValue("");
      setSearchResults([]);
      return; // Already added
    }
    setPeople([...people, userToAdd]);
    setInputValue("");
    setSearchResults([]);
    // Keep activeTag open for adding more? Or close? Let's keep it open but clear search.
  };

  const handleSelectModel = (modelToAdd) => {
    if (models.some(m => m._id === modelToAdd._id)) {
      setInputValue("");
      setSearchResults([]);
      return;
    }
    setModels([...models, modelToAdd]);
    setInputValue("");
    setSearchResults([]);
  };

  const removeTag = (type, index) => {
    if (type === 'people') {
      setPeople(people.filter((_, i) => i !== index));
    } else if (type === 'model') {
      setModels(models.filter((_, i) => i !== index));
    } else if (type === 'topic') {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/community/create`,
        { title, content, topics, people, models, posts: [] }, // posts empty as requested
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.posted) {
        const id = import.meta.env.VITE_PUBLIC_ROOM;
        people.forEach((p) => {
          emitPrivateMessage(
            user.name,
            `You are tagged in post named "${title}"`,
            id,
            p._id,
          );
        });
        models.forEach((m) => {
          emitPrivateMessage(
            user.name,
            `Your model was tagged in post named "${title}"`,
            id,
            m.createdBy._id || m.createdBy, // handle populated or ID
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

  const tagTypes = [
    { id: 'people', label: 'Tag People', icon: <PersonIcon fontSize="small" /> },
    { id: 'model', label: 'Tag Model', icon: <Inventory2Icon fontSize="small" /> },
    { id: 'topic', label: 'Tag Topic', icon: <TagIcon fontSize="small" /> },
  ];

  return (
    <div className="allPages">
      <div className="create-post-page">
        <div className="cp-header">
          <h2>Create a Post</h2>
          <button className="close-btn" onClick={() => navigate('/community')}>
            <CloseIcon />
          </button>
        </div>

        <div className="cp-body">
          <input
            className="cp-title-input"
            placeholder="Give your post a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <div className="cp-tags-section">
            <div className="cp-toolbar">
              {tagTypes.map(type => (
                <button
                  key={type.id}
                  className={`cp-tag-btn ${activeTag === type.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTag(activeTag === type.id ? null : type.id);
                    setInputValue("");
                    setSearchResults([]);
                  }}
                  title={type.label}
                >
                  <span className="icon">{type.icon}</span> {type.label}
                </button>
              ))}
            </div>

            {activeTag && (
              <div className="cp-input-container">
                <div className="cp-tag-input-row">
                  <input
                    type="text"
                    placeholder={`Search ${activeTag}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && activeTag === 'topic') handleAddTopic();
                    }}
                  />
                  {activeTag === 'topic' && (
                    <button className="cp-add-tag-confirm" onClick={handleAddTopic}>Add</button>
                  )}
                </div>

                {/* Dropdown Results */}
                {inputValue && (activeTag === 'people' || activeTag === 'model') && (
                  <div className="cp-dropdown-results">
                    {loading && <div className="cp-dropdown-item loading">Searching...</div>}
                    {!loading && searchResults.length === 0 && (
                      <div className="cp-dropdown-item no-results">No results found</div>
                    )}

                    {!loading && activeTag === 'people' && searchResults.map(u => (
                      <div key={u._id} className="cp-dropdown-item" onClick={() => handleSelectUser(u)}>
                        <PersonIcon fontSize="small" />
                        <span>{u.name}</span>
                      </div>
                    ))}

                    {!loading && activeTag === 'model' && searchResults.map(m => (
                      <div key={m._id} className="cp-dropdown-item" onClick={() => handleSelectModel(m)}>
                        {/* m.previewImg?.url ? <img... /> : <Icon /> */}
                        <Inventory2Icon fontSize="small" />
                        <span>{m.modelName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="cp-active-tags-list">
              {people.map((p, i) => (
                <span key={`p-${i}`} className="cp-chip people">
                  <PersonIcon style={{ fontSize: 16 }} /> {p.name}
                  <button onClick={() => removeTag('people', i)}><CloseIcon style={{ fontSize: 14 }} /></button>
                </span>
              ))}
              {models.map((m, i) => (
                <span key={`m-${i}`} className="cp-chip model">
                  <Inventory2Icon style={{ fontSize: 16 }} /> {m.modelName}
                  <button onClick={() => removeTag('model', i)}><CloseIcon style={{ fontSize: 14 }} /></button>
                </span>
              ))}
              {topics.map((t, i) => (
                <span key={`t-${i}`} className="cp-chip topic">
                  <TagIcon style={{ fontSize: 16 }} /> {t}
                  <button onClick={() => removeTag('topic', i)}><CloseIcon style={{ fontSize: 14 }} /></button>
                </span>
              ))}
            </div>
          </div>

          <textarea
            className="cp-content-area"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="cp-footer">
          <button className="cp-cancel-btn" onClick={() => navigate('/community')}>Cancel</button>
          <button className="cp-post-btn" onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
