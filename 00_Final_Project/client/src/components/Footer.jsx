import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        /* ===== FOOTER (FULL PAGE HEIGHT) ===== */
        .footer {
          width: 100%;
          min-height: 40vh;
          background: #0f172a;
          color: #e5e7eb;
          font-family: "Segoe UI", sans-serif;
          margin-top: 25px;
          display: flex;
          flex-direction: column;
        }

        /* ===== MAIN FOOTER CONTENT ===== */
        .footer-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 50px 80px;
          display: grid;
          grid-template-columns: 280px 200px 200px 280px;
          column-gap: 80px;
          row-gap: 50px;
          flex: 1;
        }

        /* ===== COMMON ===== */
        .footer-box h3 {
          font-size: 16px;
          margin-bottom: 12px;
          color: #38bdf8;
          font-weight: 600;
        }

        .footer-box p {
          font-size: 14px;
          line-height: 22px;
          color: #cbd5f5;
        }

        /* ===== BRAND ===== */
        .footer-box.brand {
          margin-left: -30px;
        }

        .brand h2 {
          font-size: 19px;
          color: #38bdf8;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .brand p {
          max-width: 230px;
        }

        .brand-line {
          width: 45px;
          height: 3px;
          background: #38bdf8;
          border-radius: 4px;
          margin: 10px 0 14px;
        }

        /* ===== LISTS ===== */
        .footer-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-box ul li {
          font-size: 14px;
          margin-bottom: 8px;
          cursor: pointer;
          color: #cbd5f5;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .footer-box ul li:hover {
          color: #38bdf8;
          transform: translateX(5px);
        }

        /* ===== APP STORE ===== */
        .store-images {
          display: flex;
          gap: 12px;
          margin: 12px 0;
        }

        .store-images img {
          height: 38px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .store-images img:hover {
          transform: scale(1.08);
        }

        /* ===== SOCIAL ICON IMAGES ===== */
        .social {
          display: flex;
          gap: 14px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .social img {
          width: 20px;
          height: 20px;
          cursor: pointer;
          opacity: 0.85;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .social img:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        /* ===== COPYRIGHT (UNCHANGED STYLE) ===== */
        .footer-bottom {
          text-align: center;
          padding: 15px;
          background: #020617;
          font-size: 13px;
          color: #94a3b8;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            padding: 45px 40px;
          }
        }

        @media (max-width: 600px) {
          .footer-container {
            grid-template-columns: 1fr;
            padding: 40px 25px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          {/* BRAND */}
          <div className="footer-box brand">
            <h2>Gadget Galaxy</h2>
            <div className="brand-line"></div>
            <p>
              Your one-stop destination for the latest electronic gadgets,
              accessories, and smart devices at the best prices.
            </p>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div className="footer-box">
            <h3>Customer Support</h3>
            <ul>
              <li>Help Center</li>
              <li>Order Tracking</li>
              <li>Warranty & Repair</li>
              <li>Returns & Refunds</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* SHOP */}
          <div className="footer-box">
            <h3>Shop Gadgets</h3>
            <ul>
              <li>Smartphones</li>
              <li>Laptops</li>
              <li>Headphones</li>
              <li>Smart Watches</li>
              <li>Accessories</li>
            </ul>
          </div>

          {/* BUSINESS */}
          <div className="footer-box">
            <h3>Business</h3>
            <ul>
              <li onClick={() => navigate("/become-seller")}>Become a Seller</li>
              <li onClick={() => navigate("/seller/login")}>Seller Login</li>
            </ul>

            <h3 style={{ marginTop: "16px" }}>Get Our App</h3>
            <div className="store-images">
              <img src="/play-store.png" alt="Play Store" />
              <img src="/app-store.png" alt="App Store" />
            </div>

            <div className="social">
              <img src="/facebook.png" alt="Facebook" />
              <img src="/instagram.png" alt="Instagram" />
              <img src="/twitter.png" alt="Twitter" />
              <img src="/youtube.png" alt="YouTube" />
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-bottom">
          © 2025 Gadget Galaxy | All Rights Reserved
        </div>
      </footer>
    </>
  );
};

export default Footer;
