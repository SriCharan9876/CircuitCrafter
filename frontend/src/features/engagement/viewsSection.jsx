import { Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewsSection = ({ viewCount }) => (
  <div className="views-section" style={{display:"flex",alignItems:"center", gap:"0.5rem",margin:"0",padding:"0", height:"2rem"}}>
    <VisibilityIcon fontSize="small" style={{padding:"8px",color:"grey"}}/>
    <Typography variant="body2">{viewCount}</Typography>
  </div>
    
);

export default ViewsSection;