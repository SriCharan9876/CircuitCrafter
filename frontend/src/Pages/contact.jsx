import "../Styles/contact.css"
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Contact = () => {
  const members = [
    {
      name: "Navaneeth A B S",
      email: "navaneethabs.2006@gmail.com",
      linkedin: "https://www.linkedin.com/in/navaneeth-adharapuram-190686278",
      profilePic: "https://lh3.googleusercontent.com/a/ACg8ocKDJ9Q6PhNQv3y1rKy9uRQGu4K5q_SiyFjm3tApPoRJsFaCTnlX=s96-c",
      github:"https://github.com/navaneethgold",
      telegram:"https://t.me/+nl-Q0sG3IGY0Mjc1"
    },
    {
      name: "A Sri Charan",
      email: "charan3407@gmail.com",
      linkedin: "https://www.linkedin.com/in/sri-charan-a-281532286",
      profilePic:"https://lh3.googleusercontent.com/a/ACg8ocKLTtDnuNeVenf6kkCWVe8DLc1iYRnMgKp8xyiWf6cIMNTvc86l=s96-c",
      github:"https://github.com/SriCharan9876",
      telegram:"https://t.me/+nl-Q0sG3IGY0Mjc1"
    }
  ];

  const openGmailWithEmail = (member) => {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}&su=Regarding%20Your%20Circuit%20Crafter%20Website%20&body=Hello%20${member.name},`,
      "_blank"
    );
  };

  return (
    <div className="allPages">
      <div className="contact-page">

          <section className="contact-us-section">
            <h1 className="contact-title">Contact Us</h1>
            <div className="contact-container">
              {members.map((member, index) => (
                <div key={index} className="contact-card">
                  <img src={member.profilePic} alt="Profile" className="creator-img" />
                  <h2>{member.name}</h2>
                  <div className="contact-info-container" title="Call to Contact">
                    <div className="contact-info-item" title="Gmail your Request" onClick={() => openGmailWithEmail(member)}>
                      <EmailOutlinedIcon fontSize="high"/>
                    </div>
                    <div className="contact-info-item" title="Contact through Linkedin">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{color: "var(--accent)"}}>
                        <LinkedInIcon fontSize="high"/>
                      </a>
                    </div>
                    <div className="contact-info-item" title="Join telegram Support group">
                      <a href={member.telegram} target="_blank" rel="noopener noreferrer" style={{color: "var(--accent)"}}>
                        <TelegramIcon fontSize="high"/>
                      </a>
                    </div>
                    <div className="contact-info-item" title="View Github profile">
                      <a href={member.github} target="_blank" rel="noopener noreferrer" style={{color: "var(--accent)"}}>
                        <GitHubIcon fontSize="high"/>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="about-us-section">
            <h1 className="contact-title">About Us</h1>
            <div className="about-us-content">
              <h2>Welcome to Circuit Crafter</h2>
              <p>
                At Circuit Crafter, we believe that innovation should be accessible to everyone—
                whether you’re a student beginning your journey in electronics, a hobbyist exploring
                bold ideas, or an engineer working on professional-grade prototypes. Our platform
                brings together simplicity and functionality to help transform concepts into working
                circuits with ease.
              </p>
              <p>
                No longer do you need to start from a blank slate. Circuit Crafter provides a growing
                library of ready-made circuit models that can be adapted, improved, and tailored to
                your specific needs. With just a few clicks, you can generate LTSpice simulation files,
                test your designs instantly, and refine them without unnecessary delays. By combining
                reusability with creativity, we aim to make circuit design more efficient, interactive,
                and engaging for every type of learner and innovator.
              </p>

              <h2>Our Mission</h2>
              <p>
                Our mission is to empower the global electronics community by creating a seamless
                space for circuit design, learning, and collaboration. We are committed to removing
                the barriers that often slow down innovation—whether it’s the time required to
                create designs from scratch, the complexity of advanced tools, or the difficulty in
                finding reliable resources.
              </p>
              <p>
                With Circuit Crafter, users can focus on what matters most: building, experimenting,
                and sharing ideas that push the boundaries of what is possible. By simplifying the
                process and encouraging collaboration, we hope to spark creativity, accelerate
                learning, and inspire solutions that make a real-world impact.
              </p>

              <h2>What We Offer</h2>
              <h3>1. Circuit Designing</h3>
              <ul>
                <li><SendIcon/> &nbsp;&nbsp;Explore a rich library of circuit models, from amplifiers to filters.</li>
                <li><SendIcon/>&nbsp;&nbsp;View detailed <strong>specifications, prerequisites, and descriptions</strong> before diving in.</li>
                <li><SendIcon/>&nbsp;&nbsp;Customize models with your own parameters and instantly download <strong>LTSpice simulation files</strong>.</li>
              </ul>

              <h3>2. Circuit Models Repository</h3>
              <ul>
                <li><SendIcon/>&nbsp;&nbsp;A growing collection of standard circuits, categorized and easy to search.</li>
                <li><SendIcon/>&nbsp;&nbsp;Filter by type, sort by popularity or recency, and save or share with peers.</li>
                <li><SendIcon/>&nbsp;&nbsp;Contribute your own models with design strategy, formulas, parameters, and more.</li>
                <li><SendIcon/>&nbsp;&nbsp;A clear <strong>approval workflow</strong> ensures quality and reliability.</li>
              </ul>

              <h3>3. Components Library</h3>
              <ul>
                <li><SendIcon/>&nbsp;&nbsp;Access essential components that LTSpice doesn’t provide by default.</li>
                <li><SendIcon/>&nbsp;&nbsp;Reuse, link, or create new components while designing models.</li>
                <li><SendIcon/>&nbsp;&nbsp;Approved components become available to the entire community.</li>
              </ul>

              <h3>4. Community & Collaboration</h3>
              <ul>
                <li><SendIcon/>&nbsp;&nbsp;Engage with a vibrant community through <strong>posts, queries, and discussions</strong>.</li>
                <li><SendIcon/>&nbsp;&nbsp;Tag users, models, or topics to make your conversations more meaningful.</li>
                <li><SendIcon/>&nbsp;&nbsp;Share insights, ask questions, and build connections with innovators.</li>
                <li><SendIcon/>&nbsp;&nbsp;Integrated notifications keep you updated on model approvals and interactions.</li>
              </ul>

              <h3>5. Seamless Experience</h3>
              <ul>
                <li><SendIcon/>&nbsp;&nbsp;Save and manage your own models.</li>
                <li><SendIcon/>&nbsp;&nbsp;Switch between <strong>dark and light modes</strong> for personalization.</li>
                <li><SendIcon/>&nbsp;&nbsp;Access guides and resources to maximize the platform.</li>
                <li><SendIcon/>&nbsp;&nbsp;Enjoy a <strong>fully responsive design</strong> across all devices.</li>
              </ul>

              <h2>Our Values</h2>
              <ul>
                <li style={{paddingBottom:"0.4rem"}}><strong>Innovation Made Simple</strong> – Tools that reduce complexity so creativity can thrive.</li>
                <li style={{paddingBottom:"0.4rem"}}><strong>Collaboration Over Competition</strong> – A space where knowledge is shared, not hoarded.</li>
                <li style={{paddingBottom:"0.4rem"}}><strong>Quality & Reliability</strong> – Every model and component undergoes review for accuracy.</li>
                <li style={{paddingBottom:"0.4rem"}}><strong>Community First</strong> – We grow stronger together through open discussions.</li>
              </ul>

              <h2>Why Circuit Crafter?</h2>
              <p>
                Because we’re more than just a circuit repository—we’re a <strong>platform for growth</strong>.
              </p>

                <p>Students can learn from real-world circuit strategies.</p>
                <p>Hobbyists can experiment without limits.</p>
                <p>Engineers can accelerate prototyping with reusable, reliable resources.</p>

              <p>
                At Circuit Crafter, <strong>ideas spark faster, designs scale smarter, and innovation never stops</strong>.
              </p><br />

              <p className="about-highlight"><AutoAwesomeIcon/> Let’s build the future of electronics—together.</p>
            </div>
          </section>

      </div>
    </div>
  );
};

export default Contact;
