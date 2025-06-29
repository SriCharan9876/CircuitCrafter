import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import SignUp from "./Pages/signUp";
import Login from "./Pages/login";
import Explore from "./Pages/explore";
import AddModel from "./Pages/addModel";
import Categories from "./Pages/categories"
import EachModel from "./Pages/modelEach";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/addModel" element={<AddModel />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/explore/models/:model" element={<EachModel />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
