import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ModelBox from "../features/ModelBox";
import "../Styles/explore.css"
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SortIcon from '@mui/icons-material/Sort';

const Explore = () => {
    const { token } = useAuth(); // use context
    const [allModels, setAllModels] = useState([]);
    const [searchTerm,setSearchTerm]=useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [displayModels,setDisplaymodels]=useState([]);
    const [sortBy, setSortBy] = useState("alphabetical");
    const [sortOrder, setSortOrder] = useState("asc");// or desc

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
        const filteredModels=allModels.filter((model)=>model.modelName.toLowerCase().includes(searchTerm.toLowerCase()));
        const sorted = sortModels(filteredModels, sortBy, sortOrder);
        setDisplaymodels(sorted);
        setSuggestions([]);
    }

    const sortModels = (models, criteria, order) => {
        const sorted = [...models];

        sorted.sort((a, b) => {
            let aVal, bVal;

            switch (criteria) {
                case "alphabetical":
                    aVal = a.modelName.toLowerCase();
                    bVal = b.modelName.toLowerCase();
                    break;
                case "views":
                    aVal = a.views.length;
                    bVal = b.views.length;
                    break;
                case "likes":
                    aVal = a.likes.length;
                    bVal = b.likes.length;
                    break;
                case "recent":
                    aVal = new Date(a.createdAt);
                    bVal = new Date(b.createdAt);
                    break;
                case "designCount":
                    aVal = a.designCount;
                    bVal = b.designCount;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return order === "asc" ? -1 : 1;
            if (aVal > bVal) return order === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    };


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

    useEffect(() => {
        const sorted = sortModels(displayModels, sortBy, sortOrder);
        setDisplaymodels(sorted);
    }, [sortBy, sortOrder]);

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
                    <h2 className="explore-hero-mobileheading" style={{color:"var(--text-primary)"}}>
                        Explore models
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
                        <br />
                    </div>
                    
                </div>

                <aside className="explore-hero-animation-container">
                    <video width="640" height="360" autoPlay muted loop playsInline className="explore-hero-animation" >
                        <source src="https://res.cloudinary.com/di75recky/video/upload/v1766602449/CircuitCrafter-demo_boqw7k.mp4"></source>
                        <source src="https://res.cloudinary.com/di75recky/video/upload/v1766602449/CircuitCrafter-demo_boqw7k.mp4" type="video/ogg"></source>
                        Your browser does not support the video tag.
                    </video>
                </aside>
            </div>
            
            <div className="explore-subnavbar">
                <div className="explore-sortby-types">
                    <h2 className="sort-head">Sort By:  </h2>
                    <div className="sortby-text" style={{color:"var(--text-primary)"}} title="sort by">
                        <SortIcon sx={{fontSize:"30px"}}/>
                    </div>
                    <div className={`explore-sortby-type ${sortBy === "alphabetical" ? "active" : ""}`}
                        onClick={() => setSortBy("alphabetical")}><SortByAlphaIcon/><p>Default</p></div>
                    <div className={`explore-sortby-type ${sortBy === "views" ? "active" : ""}`}
                        onClick={() => setSortBy("views")}><VisibilityOutlinedIcon/> <p>Most viewed</p></div>
                    <div className={`explore-sortby-type ${sortBy === "likes" ? "active" : ""}`}
                        onClick={() => setSortBy("likes")}><FavoriteBorderIcon/><p>Most liked</p> </div>
                    <div className={`explore-sortby-type ${sortBy === "recent" ? "active" : ""}`}
                        onClick={() => setSortBy("recent")}><UpdateIcon/> <p>Recent</p></div>
                    <div className={`explore-sortby-type ${sortBy === "designCount" ? "active" : ""}`}
                        onClick={() => setSortBy("designCount")}><TrendingUpIcon/> <p>Most designed</p></div>
                </div>

                <div className="explore-sortby-orders">
                    <div className={`explore-sortby-order sortby-increasing ${sortOrder === "asc" ? "active" : ""}`}
                        onClick={() => setSortOrder("asc")}><ArrowUpwardIcon/></div>
                    <div className={`explore-sortby-order sortby-decreasing ${sortOrder === "desc" ? "active" : ""}`}
                        onClick={() => setSortOrder("desc")}><ArrowDownwardIcon/></div>
                </div>

            </div>

            <div className="explore-models">
                {allModels.length === 0 ? (
                    <h1 style={{color:"var(--text-primary)"}}>Loading Models.....</h1>
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
