import { Outlet } from "react-router-dom";
import Sidebar from "./features/sideBar";
import NavBar from "./features/navBar";
import Footer from "./features/footer";
import "./App.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <NavBar/>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}