import { Link } from "react-router-dom";
import "../Styles/footer.css";

export default function Footer() {

  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About Circuit Crafter</h3>
          <p>
            Circuit Crafter is your go-to platform for designing, simulating, and sharing 
            electronic circuits with ease. Whether you're a student, hobbyist, or engineer, 
            we make circuit creation fast, visual, and collaborative.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/models">Circuit Models</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: support@circuitcrafter.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="socials">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a> | 
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>“Discover, Design & Deploy Smarter Circuits”</p>
        <p>&copy; {new Date().getFullYear()} Circuit Crafter. All rights reserved.</p>
      </div>
    </div>
  );
}
