import { Tooltip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewsSection = ({ viewCount,size ,theme="light-theme"}) => {
  const iconSize= size ==="small"?16:32;
  const color=(theme==="dark-theme")?"white":"grey";

  return(
    <div className="views-section" style={{display:"flex",alignItems:"center", gap:"0.1rem",margin:"0",padding:"0 0.3rem 0 0", height:"2rem"}}>
      <Tooltip title="Views">
        <VisibilityIcon sx={{ fontSize: iconSize, color:{color}  }} style={{padding:"8px"}}/>
      </Tooltip>
      <p style={{fontSize:"1.3rem"}}>{viewCount}</p>
    </div>
  )
};

export default ViewsSection;