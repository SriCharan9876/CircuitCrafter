import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import SignUp from "./Pages/signUp";
import Login from "./Pages/login";
import Explore from "./Pages/explore";
import AddModel from "./Pages/addModel";
import Categories from "./Pages/categories"
import EachModel from "./Pages/modelEach";
import AddCategory from "./Pages/addCategory";
import PendingModels from "./Pages/pendingModels";
import MyModels from "./Pages/myModels";
import EditModel from "./Pages/editModel";
import MyProfile from "./Pages/myProfile";
import Sidebar from "./features/biolerplate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* <Route element={<Sidebar/>}> */}
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/models" element={<Explore />} />
          <Route path="/models/create" element={<AddModel />} />
          <Route path="/models/:id/edit" element={<EditModel />} />
          <Route path="/models/pending" element={<PendingModels />} />
          <Route path="/models/mymodels" element={<MyModels/>} />
          <Route path="/models/:id" element={<EachModel />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/create" element={<AddCategory />} />
        {/* </Route> */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
