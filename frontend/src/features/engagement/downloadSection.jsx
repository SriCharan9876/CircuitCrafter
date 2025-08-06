import { Typography, Tooltip } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const DownloadSection = ({ designCount,theme="light-theme" }) => {
  const color=(theme==="dark-theme")?"white":"black";

  return(
    <div className="downloads-section" style={{display:"flex",alignItems:"center", gap:"0.5rem",margin:"0",padding:"0", height:"2rem"}}>
      <Tooltip title="Downloads">
        <DownloadIcon sx={{ fontSize: 32, color:{color}  }}/>
      </Tooltip>
      <Typography variant="body2">{designCount}</Typography>
    </div>
  )
};

export default DownloadSection;