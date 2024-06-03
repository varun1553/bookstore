import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center footer">
      <div className="wrapper mt-3">
        <small>
          BookMaster<br />
          <strong>Royal Melbourne Institute of Technology</strong>, All Rights Reserved
          © {new Date().getFullYear()}
        </small>
        <nav className="footer-nav">
          <a href="#">Terms of Use</a><br />
          <a href="#">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
