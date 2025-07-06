import "./CategoryBox.css";
import { useNavigate } from "react-router-dom";

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
                        onClick={()=>handleNavigate(e)}
        >
            <h4>{category.label}</h4>
            <p>{category.description}</p>
        </div>
    )
}
export default CategoryBox;