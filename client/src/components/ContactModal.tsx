import { useNavigate } from "react-router-dom";
import "../styles/AlertModal.css";

interface ContactModalProps {
  title: string;
  message: string;
  visible: boolean;
  onClose?: () => void;
}

const ContactModal = ({
  title,
  message,
  visible,
  onClose,
}: ContactModalProps) => {
  const navigate = useNavigate();

  if (!visible) return null;
  const handleContact = () => {
    navigate("/about_us");

    setTimeout(() => {
      const formElement = document.getElementById("myForm");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="alert-modal-admin-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose?.();
        }
      }}
    >
      <div
        className="alert-modal-admin-content"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        <div className="alert-modal-admin-header">
          <h5 className="alert-modal-admin-title">{title}</h5>
        </div>
        <div className="alert-modal-admin-body">
          <p>{message}</p>
        </div>
        <div className="alert-modal-admin-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleContact}
          >
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
