import UploadFileIcon from '@mui/icons-material/UploadFile';
import "../styles/ascFileUpload.css";
import { notify } from './toastManager';
import ClearIcon from '@mui/icons-material/Clear';

const AscFileUploadBox = ({ file, setFile, initialFile=null }) => {

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".asc")) {
            setFile(selectedFile);
        } else {
            notify.error("Please select a valid .asc file");
        }
    };

    const getFileName = (input) => {
        if (!input) return "";
        return typeof input === "string" ? input.split("/").pop() : input.name;
    };

    const showRevertButton = initialFile && file && getFileName(initialFile) !== file.name;

    return (
        <div className="ascFile-upload-container">
            <div className="custom-ascFile-uploadBox">
                <label
                    htmlFor="ascFileUpload"
                    className="custom-ascFile-upload"
                    style={{ fontSize: "1.25rem", fontWeight: "400" }}
                    title='modify circuit file'
                >
                    {file ? <p className="ascfile-upload-filename"> {file.name}</p> : (initialFile?"Click to change LTspice file":"Click to upload LTspice file")} &nbsp;
                    <UploadFileIcon sx={{ height: "40px" }} />
                    {showRevertButton && (
                    <button
                            type="button"
                            className="revert-upload-btn"
                            onClick={(e) => {e.preventDefault();setFile(null)}}
                            style={{color:"black", backgroundColor:"transparent", border:"none", cursor:"pointer",display:"flex"}}
                            title='revert back to original file'
                        >
                            <ClearIcon/>
                        </button>
                    )}
                </label>
                <input
                    id="ascFileUpload"
                    type="file"
                    accept=".asc"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                
            </div>
            
        </div>
    );
};

export default AscFileUploadBox;
