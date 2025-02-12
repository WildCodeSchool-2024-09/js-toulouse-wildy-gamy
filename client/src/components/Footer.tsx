import { Facebook, Instagram, MessagesSquare } from "lucide-react";
import { useState } from "react";
import logoWG from "../assets/images/logo_wildy_gamy.png";
import ConfidentialityPilocyModal from "./ConfidentialityPolicyModal";
import LegalNoticeModal from "./LegalNoticeModal";
import "../styles/Footer.css";

export default function Footer() {
  const [isLegalNoticeVisible, setLegalNoticeVisible] = useState(false);
  const [isConfidentialityPolicyVisible, setConfidentialityPolicyVisible] =
    useState(false);

  const handlelegalNotice = () => {
    setLegalNoticeVisible(true);
  };

  const handleCloselegalNotice = () => {
    setLegalNoticeVisible(false);
  };

  const handleConfidentialityPolicy = () => {
    setConfidentialityPolicyVisible(true);
  };

  const handleCloseConfidentialityPolicy = () => {
    setConfidentialityPolicyVisible(false);
  };

  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <img src={logoWG} className="footer-logo" alt="Wildy Gamy" />
          <div className="footer-contact">
            <p>8 Rue de Valenciennes, 31000 Toulouse</p>
            <p>
              05 55 55 55 55
              <br />
              wildygamy.tlse@gmail.com
            </p>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-social-links">
            <Facebook size={30} fill="#c3b0ea" color={"transparent"} />
            <Instagram size={30} />
            <MessagesSquare size={30} fill="#c3b0ea" color={"transparent"} />
          </div>
          <div className="footer-legal">
            <p
              className="footer-legal-notice"
              onClick={handlelegalNotice}
              onKeyUp={(e) => e.key === "Enter" && handlelegalNotice()}
              style={{ cursor: "pointer" }}
            >
              Mentions légales
            </p>
            <p
              className="footer-legal-notice"
              onClick={handleConfidentialityPolicy}
              onKeyUp={(e) =>
                e.key === "Enter" && handleConfidentialityPolicy()
              }
              style={{ cursor: "pointer" }}
            >
              Politique de confidentialité
            </p>
            <p>© 2025 Wildy Gamy</p>
          </div>
        </div>
      </div>
      <LegalNoticeModal
        visible={isLegalNoticeVisible}
        onClose={handleCloselegalNotice}
      />
      <ConfidentialityPilocyModal
        visible={isConfidentialityPolicyVisible}
        onClose={handleCloseConfidentialityPolicy}
      />
    </div>
  );
}
