import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"
import ComponentBox from "../features/ComponentBox";
import "../Styles/resources.css"
import { useLocation } from "react-router-dom";

const Resources = () => {
    const { user, token } = useAuth();
    const [allComponents, setAllComponents] = useState([]);
    const [compLoading, setCompLoading] = useState(true);
    const location = useLocation();

    const getComponents = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/components/all`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.message === "Success") {
                setAllComponents(res.data.allComponents);
            } else {
                notify.error("Failed to fetch components")
            }
        } catch (err) {
            console.error("Error fetching components:", err);
            notify.error("Error occurred while fetching components")
        }finally{
            setCompLoading(false);
        }
    };

    useEffect(() => {
        getComponents();
    }, []);

    useEffect(() => {
        if (!compLoading && location.hash) {
            const elementId = location.hash.replace("#", "");
            const element = document.getElementById(elementId);
            if (element) {
                const yOffset = -140; // adjust this based on your header height
                const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }
    }, [compLoading, location.hash]);


    const approvedComponents=allComponents.filter(comp=>comp.approved);
    const pendingComponents=allComponents.filter(comp=>!comp.approved&&(user)&&((user.role=="admin")||(comp.createdBy._id===user._id)));
    

    return (
        <div className="allPages">
            <div className="resources-page">

                <section className="components-section">
                    <h1 style={{textAlign:"center", marginBottom:"3rem", color:"var(--text-primary)"}}>Explore Components</h1>
                    <div className="components-container">
                    {compLoading? (
                        <h1 style={{color:"var(--text-primary)"}}>Loading components .....</h1>
                    ):(
                        approvedComponents.map((component) => (
                            <div id={`component-${component._id}`} key={component._id}>
                                <ComponentBox  component={component} onDelete={getComponents} editAccess={user&&((user.role==="admin")||(user._id===component.createdBy._id))}/>
                            </div>
                        ))
                    )}
                    </div>
                    {compLoading?null:pendingComponents.length>0&&<>
                        <h2>Pending components</h2>
                        <div className="components-container">
                        {pendingComponents.length === 0 ? (
                            <h1 style={{color:"var(--text-primary)"}}>Loading Pending components .....</h1>
                        ) : (
                            pendingComponents.map((component) => (
                                <ComponentBox component={component} key={component._id} onDelete={getComponents} editAccess={true}/>
                            ))
                        )}
                        </div>
                    </>}
                    {(!compLoading&&approvedComponents.length===0&&pendingComponents.length===0)&&<p style={{color:"var(--text-primary)", paddingLeft:"5%"}}>No Approved components found </p>}
                </section>
                
            </div>
        </div>
    );
};

export default Resources;
