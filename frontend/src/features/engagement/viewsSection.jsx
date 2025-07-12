import { Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewsSection = ({ viewCount }) => (
  <div className="views-section" style={{display:"flex",alignItems:"center", gap:"4px"}}>
    <VisibilityIcon fontSize="small" />
    <Typography variant="body2">{viewCount}</Typography>
  </div>
    
);

export default ViewsSection;