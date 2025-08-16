import { useState } from "react";
import axios from "axios";
import "../Styles/componentBox.css";
import { useAuth } from "../contexts/authContext"; // use context
import {notify} from "../features/toastManager"
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ComponentBox=(({component, onDelete, editAccess})=>{
    const { token } = useAuth(); //get current user and token
    const [copiedIndex, setCopiedIndex] = useState(null);

    const copyPath = (path, index) => {
        navigator.clipboard.writeText(path).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        });
    };

    const deleteComponent = async () => {
        try {
            const compId=component._id;
            console.log(compId);
            const res= await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/components/${compId}`, {
                withCredentials: true,
                headers: {Authorization: `Bearer ${token}`}
            });
            if (res.status === 200 || res.data?.deleted) {
                notify.success("Component deleted successfully");
                onDelete();
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            notify.error("Error in deleting component");
            console.error("Delete error:", error.response?.data || error.message);
        }
    };
    

    return(
        <div className="compBox"
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.003)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <div className="compBox-header">
                    <h2>{component.name}</h2>
                    {editAccess && (
                        <button
                            type="button"
                            className="new-component-delete-btn"
                            onClick={() => deleteComponent()}
                        >
                            <DeleteIcon /> Delete
                        </button>
                    )}
                </div>
                    
                <p>{component.description}</p><br />
                {component.files?.length>0 && (<>
                    {component.files.map((simfile,index)=>(
                        <div key={index} className="compBox-fileBox"><AttachmentIcon/>
                            <h4>{simfile.type} File </h4>
                            <a href={simfile.downloadUrl} target="_blank" rel="noopener noreferrer" className="compFile-download-btn">
                                {decodeURIComponent(simfile.downloadUrl.split('/').pop())}<DownloadIcon/>
                            </a>
                            <p>
                                <span className="path-label">Path to Save File: </span>
                                <span className="path-label-sm">Copy Path to Save File: </span>
                                <code>{simfile.savePath}</code>
                                <span className="copy-icon" onClick={()=>copyPath(simfile.savePath, index)}>
                                    {copiedIndex === index?<CheckCircleOutlineIcon fontSize="large"/>:<ContentCopyIcon fontSize="large"/>}
                                </span>
                            </p>
                        </div>
                    ))}
                </>)}
                <div className="compBox-Footer"><p>Created by @{component.createdBy?.name}</p></div>
        </div>
    )
})

export default ComponentBox;