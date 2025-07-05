import {Link,useNavigate} from "react-router-dom";
import "../Styles/biolerplate.css";
import { useState,useEffect } from "react";
import axios from "axios";
export default function Sidebar(){
    return(
        <>
          <div className="navBar"></div>
          <div className="sideBar"></div>
        </>
    );
}