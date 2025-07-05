import { useState,useEffect } from "react";
import CategoryBox from "../features/CategoryBox"
import axios from 'axios';

const Categories=()=>{
    const [allCategories,setAllCategories]=useState([]);
    
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
        .then((res)=>{
            setAllCategories(res.data.allCategories);
        })
        .catch((err)=>{
            console.log("error in loading categories", err);
        })
    },[]);

    return(
        <div className="allPages">
            <h2>All Categories</h2>
            <div className="categoryList">
                <div className="row">
                    {allCategories.length > 0 ? (
                        allCategories.map((category)=>(
                            <CategoryBox category={category} key={category._id}/>
                        ))
                    ) : (
                        <p>Loading categories...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Categories;