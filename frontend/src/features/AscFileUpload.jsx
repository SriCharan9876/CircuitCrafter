import UploadFileIcon from '@mui/icons-material/UploadFile';
import "../styles/ascFileUpload.css";
import { notify } from './toastManager';

const AscFileUploadBox = ({ file, setFile }) => {

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.name.endsWith('.asc')) {
            notify.error("Only .asc files are allowed");
            return;
        }
        setFile(selectedFile);
    };

    return (
        <div className="ascFile-upload-container">
            <div className="custom-ascFile-uploadBox">
                <label
                    htmlFor="ascFileUpload"
                    className="custom-ascFile-upload"
                    style={{ fontSize: "1.25rem", fontWeight: "400" }}
                >
                    {file ? <p style={{ margin: "0" }}>{file.name}</p> : "Choose ltspice File"} &nbsp;
                    <UploadFileIcon sx={{ height: "40px" }} />
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
