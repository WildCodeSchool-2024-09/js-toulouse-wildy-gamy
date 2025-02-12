import "../styles/PrizeExchangeModal.css";

interface PrizeExchangeModalProps {
  prizeName: string;
  prizeCost: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const PrizeExchangeModal = ({
  prizeName,
  prizeCost,
  onConfirm,
  onCancel,
}: PrizeExchangeModalProps) => {
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="exchange-modal-overlay"
      onKeyDown={onCancel}
      onClick={onCancel}
    >
      <div
        className="exchange-modal-content"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={handleModalClick}
      >
        <h2>Confirmer l'échange</h2>
        <p>
          Voulez-vous échanger {prizeCost} points contre le prix "{prizeName}" ?
        </p>
        <div className="exchange-modal-buttons">
          <button
            type="button"
            className="exchange-button cancel"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            type="button"
            className="exchange-button confirm"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrizeExchangeModal;
