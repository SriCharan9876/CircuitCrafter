import { Outlet } from "react-router-dom";
import Sidebar from "./features/sideBar";
import NavBar from "./features/navBar";
import Footer from "./features/footer";
import { useState } from "react";
import "./App.css";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <NavBar toggleSidebar={toggleSidebar} />
      
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
