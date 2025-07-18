import { Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const DownloadSection = ({ designCount }) => {
  return(
    <div className="downloads-section" style={{display:"flex",alignItems:"center", gap:"0.5rem",margin:"0",padding:"0", height:"2rem"}}>
      <DownloadIcon sx={{ fontSize: 32 }}/>
      <Typography variant="body2">{designCount}</Typography>
    </div>
  )
};

export default DownloadSection;