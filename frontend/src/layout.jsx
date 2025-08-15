import { Outlet } from "react-router-dom";
import Sidebar from "./features/sideBar";
import NavBar from "./features/navBar";
import Footer from "./features/footer";
import { useState, useRef, useEffect } from "react";
import "./App.css";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="layout">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        setSidebarOpen={setSidebarOpen}
        sidebarRef={sidebarRef} // pass ref to Sidebar
      />
      <NavBar toggleSidebar={toggleSidebar} />

      <div className="main-content">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
