import { GoogleLogin } from '@react-oauth/google';
import { notify } from './toastManager';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginButton() {
  const { login } = useAuth(); // your context method
  const navigate=useNavigate();
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      // Send token to backend for verification and user creation/login
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-login`,
        { token: googleToken },
        { withCredentials: true }
      );

      if (res.data.token) {
        login(res.data.token);
        notify.success("Login Successful");
        navigate("/models");
      } else {
        notify.error("Google login failed. Try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      notify.error("Google login failed. Try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        console.error("Google Login Failed");
        notify.error("Google Login Failed");
      }}
    />
  );
}
