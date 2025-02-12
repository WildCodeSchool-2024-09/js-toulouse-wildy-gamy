import "../styles/DeleteAccountConfirmModal.css";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  showCloseButton?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  showCloseButton = true,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="delete-confirm-modal-overlay"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="delete-confirm-modal-content"
        onClick={handleModalClick}
        onKeyDown={handleKeyDown}
      >
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="delete-confirm-modal-buttons">
          {showCloseButton && (
            <button
              type="button"
              className="delete-confirm-button cancel"
              onClick={onClose}
            >
              Annuler
            </button>
          )}
          <button
            type="button"
            className="delete-confirm-button confirm"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
