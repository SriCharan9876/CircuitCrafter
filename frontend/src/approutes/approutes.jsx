import { Route } from "react-router-dom";
import Layout from "../layout";
import SignUp from "../Pages/signUp";
import Login from "../Pages/login";
import Explore from "../Pages/explore";
import AddModel from "../Pages/addModel";
import Categories from "../Pages/categories";
import EachModel from "../Pages/modelEach";
import AddCategory from "../Pages/addCategory";
import PendingModels from "../Pages/pendingModels";
import MyModels from "../Pages/myModels";
import EditModel from "../Pages/editModel";
import MyProfile from "../Pages/myProfile";
import Favourites from "../Pages/favourites";
import Contact from "../Pages/contact";
import Community from "../Pages/community";
import CreatePost from "../Pages/createPost";
import PostDetail from "../Pages/eachPost";
import NotFound from "../Pages/NotFound";

import { PrivateRoute } from "./ProtectedRoutes";

export const approutes = (
  <>
    <Route path="/signUp" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Layout />}>

      <Route element={<PrivateRoute />}>

        <Route path="myprofile" element={<MyProfile />} />

        <Route path="models/create" element={<AddModel />} />
        <Route path="models/mymodels" element={<MyModels />} />
        <Route path="models/pending" element={<PendingModels />} />
        <Route path="models/favourites" element={<Favourites />} />
        <Route path="models/:id/edit" element={<EditModel />} />

        <Route path="categories/create" element={<AddCategory />} />
        
        <Route path="community/createPost" element={<CreatePost />} />
        <Route path="community/:id" element={<PostDetail />} />
      </Route>

      <Route path="models" element={<Explore />} />
      <Route path="models/:id" element={<EachModel />} />
      <Route path="categories" element={<Categories />} />
      <Route path="contact" element={<Contact />} />
      <Route path="community" element={<Community />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
