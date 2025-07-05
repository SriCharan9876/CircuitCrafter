import { Outlet } from "react-router-dom";
import Sidebar from "./features/biolerplate";
import "./App.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}