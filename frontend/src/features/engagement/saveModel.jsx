import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { notify } from '../toastManager';
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';

const SaveButton = ({ modelId, savedModels, token ,refreshFavorites,size}) => {
  const {setUser,user} =useAuth();
  const [saved, setSaved] = useState(savedModels.includes(modelId));
  const [isLoading, setIsLoading] = useState(false);
  const iconSize= size ==="small"?22:32;

  const toggleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const newSavedStatus = !saved;

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/save`,
        { modelId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSaved(newSavedStatus);

      setUser((prevUser) => ({
        ...prevUser,
        savedModels: newSavedStatus
          ? [...prevUser.savedModels, modelId]
          : prevUser.savedModels.filter((id) => id !== modelId),
      }));
      if (refreshFavorites) refreshFavorites();
      notify.success(newSavedStatus ? 'Model saved!' : 'Model removed from saved list');
    } catch (err) {
      console.error("Error toggling saved model:", err);
      notify.error("Failed to update saved status");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="save-section" style={{display:"flex",alignItems:"center", margin:"0",padding:"0", height:"2.5rem"}}>
      <Tooltip title={saved ? 'Unsave Model' : 'Save Model'}>
        <IconButton onClick={toggleSave} disabled={isLoading} color={saved ? 'primary' : 'default'}>
          {saved ? <BookmarkIcon sx={{ fontSize: iconSize }}/> : <BookmarkBorderIcon sx={{ fontSize: iconSize }}/>}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default SaveButton;
