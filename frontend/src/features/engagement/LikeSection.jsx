import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { notify } from '../toastManager';
import axios from 'axios';

const LikeButton=(({modelId,userId,initialLikes,token,size, theme="light-theme"})=>{

    const [likes,setLikes]=useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    const hasLiked=likes.includes(userId);
    const iconSize= size ==="small"?22:32;
    const color=(theme==="dark-theme")?"white":"black";

    const togglelike = async()=>{
        if (isLoading) return;
        setIsLoading(true);
        try{
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${modelId}/like`,{},{
                headers:{Authorization:`Bearer ${token}`},
                withCredentials:true
            });
            setLikes((prevLikes)=>
                hasLiked
                    ?prevLikes.filter((id)=>id!==userId)
                    :[...prevLikes,userId]    
            );
        }catch(err){
            console.error("Error updating model status", err);
            notify.error("Login to Like the model");
        }finally{
            setIsLoading(false);
        }
    }   

    return (
        <div className='like-section' style={{display:"flex",flexDirection:"row",alignItems:"center", margin:"0",padding:"0",height:"2rem"}}>
            <Tooltip title={hasLiked ? "Unlike" : "Like"}>
                <IconButton  onClick={togglelike} disabled={isLoading} color={hasLiked ? 'error' : 'default'}>
                {hasLiked ? <FavoriteIcon sx={{ fontSize: iconSize }} /> : <FavoriteBorderIcon sx={{ fontSize: iconSize, color:{color} }} />}
                </IconButton>
            </Tooltip>
            <p style={{fontSize:"1.3rem"}}>{likes.length}</p>
        </div>
    )
})

export default LikeButton;