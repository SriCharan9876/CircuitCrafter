import React from "react";

const CategoryBox=({category})=>{
    return(
        <div className="categoryBox col">
            <h4>{category.label}</h4>
            <p>{category.description}</p>
        </div>
    )
}
export default CategoryBox;