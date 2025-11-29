import React from 'react';
import '../../../assets/styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <h5>Olaf</h5>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
              A modern platform for sharing ideas, stories, and knowledge. 
              Connect with like-minded individuals and discover amazing content.
            </p>
            <div className="footer-social">
              <a href="#twitter" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#facebook" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#github" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h5>Categories</h5>
            <ul>
              <li><a href="#technology">Technology</a></li>
              <li><a href="#design">Design</a></li>
              <li><a href="#business">Business</a></li>
              <li><a href="#lifestyle">Lifestyle</a></li>
              <li><a href="#education">Education</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h5>Support</h5>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#feedback">Feedback</a></li>
              <li><a href="#bug-report">Bug Report</a></li>
              <li><a href="#feature-request">Feature Request</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <a href="#home" className="footer-logo">
            Olaf
          </a>
          <p className="footer-copyright">
            © 2024 Olaf. All rights reserved. Made with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
