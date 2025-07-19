import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ToastManager from "./features/toastManager";
import { AuthProvider } from "./contexts/authContext";
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
import Layout from "./layout";
import Favorities from "./Pages/favorities";
import Contact from "./Pages/contact";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastManager/>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout/>}>
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="models" element={<Explore />} />
            <Route path="models/create" element={<AddModel />} />
            <Route path="models/:id/edit" element={<EditModel />} />
            <Route path="models/pending" element={<PendingModels />} />
            <Route path="models/mymodels" element={<MyModels/>} />
            <Route path="models/:id" element={<EachModel />} />
            <Route path="/favorities" element={<Favorities />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<AddCategory />} />
            <Route path="/contact" element={<Contact />} />
          </Route>  
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
