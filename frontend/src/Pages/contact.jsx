import React from "react";
import "../Styles/contact.css"
const Contact = () => {
  const members = [
    {
      name: "Navaneeth A B S",
      phone: "+91 7207308437",
      email: "navaneethabs.2006@gmail.com",
      linkedin: "https://www.linkedin.com/in/adharapuram-navaneeth-190686278/"
    },
    {
      name: "A Sri Charan",
      phone: "+91 9014379935",
      email: "charan3407@gmail.com",
      linkedin: "https://www.linkedin.com/in/sri-charan-appala-281532286"
    }
  ];

  const openGmailWithEmail = (email) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  };

  return (
    <div className="allPages">
      <h1 className="contact-title">Contact Us</h1>
      <div className="card-container">
        {members.map((member, index) => (
          <div key={index} className="contact-card">
            <h2>{member.name}</h2>
            <p><strong>Phone:</strong> {member.phone}</p>
            <p>
              <strong>Email:</strong>{" "}
              <span
                className="email-link"
                onClick={() => openGmailWithEmail(member.email)}
              >
                {member.email}
              </span>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
