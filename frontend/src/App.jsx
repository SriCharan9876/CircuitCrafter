import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import SignUp from "./Pages/signUp";
import Login from "./Pages/login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
