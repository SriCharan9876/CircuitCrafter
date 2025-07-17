import { Link } from "react-router-dom";
import "../Styles/footer.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Footer() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Example: Fetching a quote for footer (optional)
    axios.get("https://api.quotable.io/random")
      .then((res) => setQuote(res.data.content))
      .catch(() => setQuote("Inspiring minds with code."));
  }, []);

  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            We build smart tools for students and developers to plan, learn, and grow efficiently.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: support@yourapp.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="socials">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a> | 
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>“{quote}”</p>
        <p>&copy; {new Date().getFullYear()} Circuit Crafter. All rights reserved.</p>
      </div>
    </div>
  );
}
