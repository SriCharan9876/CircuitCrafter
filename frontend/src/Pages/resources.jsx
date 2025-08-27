import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"
import ComponentBox from "../features/ComponentBox";
import "../Styles/resources.css"
import { useLocation } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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

                <section className="about-us-section">
                    <h1 className="contact-title">Explore Components</h1>
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

                <section className="about-us-section">
                    <h1 className="contact-title">Getting Started with Circuit Crafter</h1>
                    <div className="about-us-content">

                        <h2>Welcome</h2>
                        <p>
                        Welcome to <strong>Circuit Crafter</strong> – an interactive platform to 
                        <strong> explore, design, simulate, and share electronic circuits</strong>. 
                        Our mission is to make circuit creation simple, accessible, and collaborative for everyone. 
                        Whether you’re a beginner learning the basics, a hobbyist experimenting with ideas, 
                        or a professional working on detailed models, this platform has something for you. 
                        This guide will walk you through the key features and help you quickly understand 
                        how to get the most out of Circuit Crafter.
                        </p>

                        <h2>1. Browsing Circuits (No Account Needed)</h2>
                        <p>You can start exploring immediately without logging in:</p>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;Visit the <strong>Explore Models</strong> page to see published circuits.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Each model page includes a <strong>description, specifications, prerequisites, and category</strong>.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Use <strong>filters and sorting</strong> (by category, design count, popularity, or upload time) to find models easily.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Visit the <strong>Categories</strong> page to explore models by their category (like amplifier, rectifier,..).</li>
                        </ul>

                        <h2>2. Creating an Account</h2>
                        <p>
                        You can freely <strong>browse and explore all circuit models</strong> on Circuit Crafter without creating an account. 
                        However, to unlock the full experience, you’ll need to <strong>register or log in</strong>. 
                        </p>
                        <p>Once logged in, you gain access to these features:</p>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Like and save models</strong> to your personal library for quick access anytime.</li>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Design circuits</strong> by entering your requirements and instantly generate downloadable LTSpice files.</li>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Upload and publish</strong> your own models.</li>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Engage with the community</strong> by creating posts, commenting, and liking.</li>
                        </ul>

                        <h2>3. Save & Design Circuits</h2>
                        <p>This is the <strong>main feature</strong> of Circuit Crafter:</p>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;Open any model after logging in.</li>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Save</strong> it to your personal collection, or <strong>Design</strong> it by entering your requirements (e.g., gain, cutoff frequency).</li>
                        <li><SendIcon/>&nbsp;&nbsp;Circuit Crafter automatically calculates component values using predefined formulas.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Download the generated <strong>LTSpice simulation file (.asc)</strong> and test it in LTSpice.</li>
                        </ul>
                        <p><AutoAwesomeIcon/> This saves you from manual calculations and gives you a ready-to-run simulation file.</p>

                        <h2>4. Adding Your Own Circuit Model</h2>
                        <p>Have a circuit strategy or design to share? You can contribute:</p>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;Provide the <strong>name, description, category, LTSpice file, and preview image</strong>.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Define <strong>parameters, formulas, specifications, and prerequisites</strong>.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Submit the model for <strong>admin approval</strong> before publishing.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Once approved, others can <strong>save, design, and learn</strong> from your model.</li>
                        <li><SendIcon/>&nbsp;&nbsp;You can edit or delete your models at any time.</li>
                        </ul>

                        <h2>5. Working with Components</h2>
                        <p>Some circuits need special components that LTSpice doesn’t provide by default:</p>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;Download extra components from the <strong>Resources page</strong>.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Save them to the specified location before running generated files.</li>
                        <li><SendIcon/>&nbsp;&nbsp;While creating a model, link existing components or upload new ones.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Components are reviewed and approved before publishing.</li>
                        </ul>

                        <h2>6. Community & Collaboration</h2>
                        <p>Circuit Crafter includes a <strong>community space</strong> for knowledge sharing:</p>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;Create <strong>posts</strong> to share information, ask questions, or collaborate.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Tag <strong>users, models, or topics</strong> to make posts more meaningful.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Others can comment and engage with your posts.</li>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Mentions page </strong> to view posts in which you are mentioned or your posts, models are tagged</li>
                        </ul>

                        <h2>7. Notifications & User Pages</h2>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;<strong>Notifications</strong> alert you about approvals, replies, and updates.</li>
                        <li><SendIcon/>&nbsp;&nbsp;The <strong>Saved Models</strong> page shows all the models you’ve saved to revisit later.</li>
                        <li><SendIcon/>&nbsp;&nbsp;The <strong>My Models</strong> page lists the models you’ve uploaded and shared with the community.</li>
                        <li><SendIcon/>&nbsp;&nbsp;The <strong>My Account</strong> page lets you view your account details and access your last generated LTSpice file.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Manage your account with options like <strong>logout, delete account, and switch between dark/light mode</strong>.</li>
                        </ul>


                        <h2>8. Accessibility & Experience</h2>
                        <ul>
                        <li><SendIcon/>&nbsp;&nbsp;A fully <strong>responsive design</strong> works across desktops, tablets, and mobiles.</li>
                        <li><SendIcon/>&nbsp;&nbsp;Switch between  <strong>dark and light modes</strong> for personalization.</li>
                        <li><SendIcon/>&nbsp;&nbsp;A clean, simple interface keeps the focus on <strong>design and experimentation</strong>.</li>
                        </ul>

                        <br/>
                        <p className="about-highlight">
                        <AutoAwesomeIcon/> With these steps, you’re ready to explore, design, and share circuits with Circuit Crafter!
                        </p>
                    </div>
                </section>

                <section className="about-us-section">
  <h1 className="contact-title">Getting Started with LTSpice</h1>
  <div className="about-us-content">

    <h2>1. Installation</h2>
    <p>
      LTSpice is a free, industry-standard circuit simulation software developed by 
      <strong> Analog Devices</strong>. To begin:
    </p>
    <ul>
      <li><SendIcon/>&nbsp;&nbsp;Download LTSpice from the official Analog Devices website.</li>
      <li><SendIcon/>&nbsp;&nbsp;Choose the installer for <strong>Windows, macOS, or Linux (via Wine)</strong>.</li>
      <li><SendIcon/>&nbsp;&nbsp;Install and launch the application to access a blank schematic workspace.</li>
    </ul>

    <h2>2. Exploring the Interface</h2>
    <p>The LTSpice workspace consists of:</p>
    <ul>
      <li><SendIcon/>&nbsp;&nbsp;<strong>Toolbar</strong> – Quick access to resistors, capacitors, sources, and ground.</li>
      <li><SendIcon/>&nbsp;&nbsp;<strong>Schematic Editor</strong> – Main area where `.asc` files are created and modified.</li>
      <li><SendIcon/>&nbsp;&nbsp;<strong>Simulation Controls</strong> – Tools for defining and executing analyses.</li>
    </ul>

    <h2>3. Running Circuit Crafter Models</h2>
    <p>
      Circuit Crafter provides ready-to-use <strong>LTSpice schematic files (.asc)</strong>. To run them:
    </p>
    <ul>
      <li><SendIcon/>&nbsp;&nbsp;Open LTSpice → <strong>File &gt; Open</strong> → Select the downloaded `.asc` file.</li>
      <li><SendIcon/>&nbsp;&nbsp;Verify if any external component libraries are required.</li>
      <li><SendIcon/>&nbsp;&nbsp;Click the <strong>Run (running man icon)</strong> to simulate.</li>
      <li><SendIcon/>&nbsp;&nbsp;Use the <strong>probe tool</strong> to visualize voltages and currents.</li>
    </ul>

    <h2>4. Integrating Custom Components</h2>
    <p>
    Some circuits use components not available in LTSpice by default. Circuit Crafter provides these
    as <strong>symbol (.asy)</strong>, <strong>schematic (.asc)</strong>, or <strong>library (.lib/.sub)</strong> files:
    </p>
    <ul>
    <li><SendIcon/>&nbsp;&nbsp;Download the required component files from the <strong>Resources page</strong>.</li>
    <li><SendIcon/>&nbsp;&nbsp;Save <strong>symbol (.asy)</strong> and <strong>schematic (.asc)</strong> files to: 
        <code> C:\Users\{'{'}Username{'}'}\AppData\Local\LTspice\lib\sym</code>
    </li>
    <li><SendIcon/>&nbsp;&nbsp;Save <strong>model libraries (.lib/.sub)</strong> to: 
        <code> C:\Users\{'{'}Username{'}'}\AppData\Local\LTspice\lib\sub</code>
    </li>
    <li><SendIcon/>&nbsp;&nbsp;When required, include the model library in your schematic using a directive: 
        <code> .include filename.lib</code>
    </li>
    </ul>


    <h2>5. Common Simulation Modes</h2>
    <ul>
      <li><SendIcon/>&nbsp;&nbsp;<strong>Transient Analysis</strong> – Observe time-domain signals.</li>
      <li><SendIcon/>&nbsp;&nbsp;<strong>AC Sweep</strong> – Analyze frequency response of circuits.</li>
      <li><SendIcon/>&nbsp;&nbsp;<strong>DC Operating Point</strong> – Check steady-state voltages and currents.</li>
      <li><SendIcon/>&nbsp;&nbsp;<strong>Noise Analysis</strong> – Study the impact of noise in circuits.</li>
    </ul>

    <h2>6. Best Practices</h2>
    <ul>
      <li><SendIcon/>&nbsp;&nbsp;Always include a <strong>GND symbol</strong> – LTSpice requires a ground connection.</li>
      <li><SendIcon/>&nbsp;&nbsp;Adjust <strong>simulation parameters</strong> via Simulate &gt; Edit Simulation Cmd.</li>
      <li><SendIcon/>&nbsp;&nbsp;Save projects frequently – LTSpice does not auto-save.</li>
      <li><SendIcon/>&nbsp;&nbsp;Use <strong>labels</strong> and hierarchical schematics for complex designs.</li>
    </ul>

    <h2>7. Learning Resources</h2>
    <ul>
      <li><SendIcon/>&nbsp;&nbsp;Explore the <strong>Help menu</strong> in LTSpice for tutorials.</li>
      <li><SendIcon/>&nbsp;&nbsp;Visit <strong>Analog Devices LTSpice resources</strong> for detailed guides.</li>
      <li><SendIcon/>&nbsp;&nbsp;Join the <strong>Circuit Crafter community</strong> for shared tips and `.asc` examples.</li>
    </ul>

    <br/>
    <p className="about-highlight">
      <AutoAwesomeIcon/> With LTSpice and Circuit Crafter together, you can move from design to 
      simulation seamlessly and bring your circuit ideas to life.
    </p>
  </div>
</section>

                
            </div>
        </div>
    );
};

export default Resources;
