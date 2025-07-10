import { useNavigate } from "react-router-dom";
import "../Styles/categoryBox.css"

const CategoryBox=({category})=>{
    const navigate=useNavigate();
    const handleNavigate=()=>{
        navigate(`/models?category=${category.name}`);
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
                        onClick={()=>handleNavigate()}
        >
            <h4>{category.label}</h4>
            <img
                src={category.visual.url}
                alt={category.name}
                style={{
                    width:"200px"
                }}
            />
            <p>{category.description}</p>
        </div>
    )
}
export default CategoryBox;