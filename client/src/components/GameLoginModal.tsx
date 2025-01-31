import "../styles/GameLoginModal.css";

interface GameLoginModalProps {
  onClose: () => void;
}

export default function GameLoginModal({ onClose }: GameLoginModalProps) {
  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <button className="login-modal-close" type="button" onClick={onClose}>
          ×
        </button>
        <h2>Connectez-vous pour jouer</h2>
        <p>Vous devez être connecté pour pouvoir jouer à ce jeu.</p>
        <button
          className="login-modal-button"
          type="button"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
