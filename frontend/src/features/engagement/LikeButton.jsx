import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { notify } from '../toastManager';
import axios from 'axios';
import './LikeButton.css';

const LikeButton=(({modelId,userId,initialLikes,token})=>{

    const [likes,setLikes]=useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    const hasLiked=likes.includes(userId);

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
            notify.error("Error Liking the model")
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className='like-section'>
            <Tooltip title={hasLiked ? "Unlike" : "Like"}>
                <IconButton onClick={togglelike} disabled={isLoading} color={hasLiked ? 'error' : 'default'}>
                {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Tooltip>
            <Typography variant="body2">{likes.length}</Typography>
        </div>
    )
})

export default LikeButton;