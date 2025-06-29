import { useState,useEffect } from "react";
import CategoryBox from "../features/CategoryBox"
import axios from 'axios';

const Categories=()=>{
    const [allCategories,setAllCategories]=useState([]);
    
    useEffect(()=>{
        axios.get("/api/categories")
        .then((res)=>{
            setAllCategories(res.data.Categories);
        })
        .catch((err)=>{
            console.log("error in loading categories", err);
        })
    })

    return(
        <div>
            <h2>All Categories</h2>
            <div className="categoryList">
                <div className="row">
                    {allCategories.map((category)=>{
                        <CategoryBox category={category} key={category._id}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Categories;