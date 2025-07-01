import React from "react";
import "./CategoryBox.css";
import { useNavigate } from "react-router-dom";

const CategoryBox=({category})=>{
    const navigate=useNavigate();
    const handleNavigate=(categoryName)=>{
        navigate(`/models?category=${categoryName}`);
    }
    return(
        <div className="categoryBox col" style={{
                            width: "98%",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "20px",
                            cursor:"pointer"
                        }}
                        onClick={()=>handleNavigate(category.name)}
        >
            <h4>{category.label}</h4>
            <p>{category.description}</p>
        </div>
    )
}
export default CategoryBox;