import { useNavigate } from "react-router-dom";

const ModelBox=(({model})=>{
    const navigate = useNavigate();
    const handleNavigate=(modelId)=>{
        navigate(`/models/${modelId}`);
    }
    return(
        <div className="modelBox"
                        key={model._id}
                        style={{
                            width: "98%",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "20px",
                            cursor:"pointer"
                        }}
                        onClick={()=>handleNavigate(model._id)}
                    >
                        <h2>{model.modelName}</h2>
                        <p><strong>Type:</strong> {model.typeName}</p>
                        {/* <p><strong>Description:</strong> {model.description || "N/A"}</p> */}
                        {/* <p><strong>File URL:</strong> <a href={model.fileUrl} target="_blank" rel="noreferrer">{model.fileUrl}</a></p> */}
                        <p><strong>Owned By:</strong> {model.createdBy.name}</p>
                        {/* <p><strong>Approved:</strong> {model.approved ? "Yes" : "No"}</p> */}
                        {/* <p><strong>Created At:</strong> {new Date(model.createdAt).toLocaleString()}</p> */}
                    </div>
    )
})

export default ModelBox;