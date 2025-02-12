import "../styles/PrizeAuthModal.css";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  onClose: () => void;
}

const PrizeAuthModal = ({ onClose }: AuthModalProps) => {
  const navigate = useNavigate();

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLoginClick = () => {
    navigate("/login");
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onKeyDown={onClose} onClick={onClose}>
      <div
        className="auth-modal-content"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={handleModalClick}
      >
        <h2>Connexion requise</h2>
        <p>Connectez-vous pour échanger des points contre des prix !</p>
        <div className="auth-modal-buttons">
          <button
            type="button"
            className="auth-button cancel"
            onClick={onClose}
          >
            Fermer
          </button>
          <button
            type="button"
            className="auth-button login"
            onClick={handleLoginClick}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrizeAuthModal;
