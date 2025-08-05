import { useNavigate } from "react-router-dom";
import "../Styles/categoryBox.css"

const CategoryBox=({category})=>{
    const navigate=useNavigate();
    const handleNavigate=()=>{
        navigate(`/models?category=${category.name}`);
    }
    return(
        <div className="categoryBox col" style={{
                            width: "90%",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "20px",
                            cursor:"pointer"
                        }}
                        onClick={()=>handleNavigate()}
        >
            <h3 className="catlabel">{category.label}</h3>
            <img
                src={category.visual.url}
                alt={category.name}
                id="catImg"
            />
            <p className="catDes"><b>Purpose: </b>{category.description}</p>
        </div>
    )
}
export default CategoryBox;