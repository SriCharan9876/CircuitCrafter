import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { notify } from '../toastManager';
import axios from 'axios';
import './saveModel.css';

const SaveButton = ({ modelId, savedModels, token }) => {
  const [saved, setSaved] = useState(savedModels.includes(modelId));
  const [isLoading, setIsLoading] = useState(false);

  const toggleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/save`,
        { modelId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
    
      const newSavedStatus = !saved;
      setSaved(newSavedStatus);
      notify.success(newSavedStatus ? 'Model saved!' : 'Model removed from saved list');
    } catch (err) {
      console.error("Error toggling saved model:", err);
      notify.error("Failed to update saved status");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="save-section">
      <Tooltip title={saved ? 'Unsave Model' : 'Save Model'}>
        <IconButton onClick={toggleSave} disabled={isLoading} color={saved ? 'primary' : 'default'}>
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default SaveButton;
