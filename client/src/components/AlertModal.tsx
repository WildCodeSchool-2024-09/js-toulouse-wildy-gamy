import "../styles/AlertModal.css";

interface AlertModalAdminProps {
  title: string;
  message: string;
  visible: boolean;
  onConfirm: () => void;
  onClose?: () => void;
}

const AlertModalAdmin = ({
  title,
  message,
  visible,
  onConfirm,
  onClose,
}: AlertModalAdminProps) => {
  if (!visible) return null;

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
        onKeyUp={(e) => e.stopPropagation()}
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
            onClick={() => {
              onConfirm();
              onClose?.();
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModalAdmin;
