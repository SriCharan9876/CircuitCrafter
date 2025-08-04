import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ToastManager from "./features/toastManager";
import { AuthProvider } from "./contexts/authContext";
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { approutes } from "./approutes/approutes";
import { ThemeProvider } from "./contexts/themeContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <ThemeProvider>
            <ToastManager/>
            <Routes>{approutes}</Routes>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App;
