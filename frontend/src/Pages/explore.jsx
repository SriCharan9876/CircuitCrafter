import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ModelBox from "../features/ModelBox";
import "../Styles/explore.css"
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Footer from "../features/footer";

const Explore = () => {
    const { token } = useAuth(); // use context
    const [allModels, setAllModels] = useState([]);
    const [searchTerm,setSearchTerm]=useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [displayModels,setDisplaymodels]=useState([]);

    //Get category query if exists
    const location = useLocation(); // Get current URL info
    const queryParams = new URLSearchParams(location.search); // return function to search in parsed query string (?key=value)
    const selectedCategory = queryParams.get("category"); // Get value of 'category' param
    const searchRef = useRef(null);//To assign a ref "searchref" for search section for usestate to identify 
                                    // user clicks on search section or outside, for closing search suggestions dropdown.

    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models`, {
                params:selectedCategory?{category:selectedCategory}:{},
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.message === "Success") {
                setAllModels(res.data.allModels);
                setDisplaymodels(res.data.allModels);
            } else {
                notify.error("Failed to fetch models");
            }
        } catch (err) {
            console.error("Error fetching models:", err);
            notify.error("Error occurred while fetching models")
        }
    };

    const handleInputChange=(e)=>{
        const value=e.target.value;
        setSearchTerm(value);
        const matches=allModels
                            .filter((model)=>model.modelName.toLowerCase().includes(value.toLowerCase()))
                            .map((model)=>model.modelName);
        setSuggestions(value?matches.slice(0,5):[]);
    }    

    const filterModels=()=>{
        const filteredModels=allModels.filter((model)=>model.modelName.toLowerCase().includes(searchTerm.toLowerCase()))
        setDisplaymodels(filteredModels);
        setSuggestions([]);
    }

    useEffect(() => {
        getModels();
    }, [selectedCategory]);

    useEffect(() => {
        if (searchTerm === "") {
            setDisplaymodels(allModels);
        }
    }, [searchTerm, allModels]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSuggestions([]);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="allPages">
        <div className="models-view-page">
    
            <div className="explore-hero">
                <div className="explore-hero-content-container">
                    <h1 className="explore-hero-heading">
                        Discover, <span className="highlight" >Design</span> & Deploy <br />Smarter Circuits
                    </h1>
                    <h2 className="explore-hero-subheading">
                        From community-made circuits to custom designs <br /> Build exactly what you need, faster than ever.
                    </h2>
                    <div className="model-search-section" ref={searchRef}>
                        <div className="model-searchbox">
                            <input type="text" 
                                    placeholder="What kind of model are you looking for?" 
                                    className="model-searchbar" 
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === "Enter") filterModels();
                                    }}
                                    onFocus={() => {
                                        const matches = allModels
                                            .filter((model) =>
                                                model.modelName.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((model) => model.modelName);
                                        setSuggestions(searchTerm ? matches.slice(0, 5) : []);
                                    }}/>

                            {searchTerm && (
                                <button className="model-search-clrbtn" onClick={() => setSearchTerm("")}><CloseIcon style={{cursor:"pointer"}}/></button>
                            )}

                            <button className="model-search-btn" onClick={()=>filterModels()}>
                                <SearchIcon/>   
                            </button> 
                        </div>
                        <br />

                        {suggestions.length>0&&(
                        <div className="model-search-suggestions">
                            <ul className="model-search-suggestion-list">
                                {suggestions.map((sugg,idx)=>(
                                <li
                                    key={idx}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        setSuggestions([]);
                                        const filtered = allModels.filter((model) =>
                                            model.modelName.toLowerCase().includes(sugg.toLowerCase())
                                        );
                                        setSearchTerm(sugg);
                                        setDisplaymodels(filtered);
                                    }}>
                                        <SearchIcon/> 
                                    {sugg}
                                </li>))}
                            </ul>
                        </div>)
                        }

                    </div>
                    
                </div>

                <aside className="explore-hero-animation-container">
                    <video width="640" height="360" autoPlay muted loop playsInline className="explore-hero-animation" >
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></source>
                        <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg"></source>
                        Your browser does not support the video tag.
                    </video>
                </aside>
            </div>
            
            <div className="explore-subnavbar">
                Filters
            </div>

            <div className="explore-models">
                {allModels.length === 0 ? (
                    <p>Loading models....</p>
                ) : displayModels.length==0?(
                    <p style={{ padding: "1rem", color: "gray" }}>No models found</p>
                ) : (
                <div className="model-grid">
                    {displayModels.map((model) => (
                    <ModelBox model={model} key={model._id} onDelete={getModels} />
                    ))}
                </div>
                )}
            </div>
            
        </div>
        </div>
    );
};

export default Explore;
