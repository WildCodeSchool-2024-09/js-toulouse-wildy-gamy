import { useState } from "react";
import coin from "../assets/images/coin.svg";
import logoWG from "../assets/images/logo_wildy_gamy.png";
import PrizeAuthModal from "../components/PrizeAuthModal";
import PrizeExchangeModal from "../components/PrizeExchangeModal";
import type { Prize } from "../services/types";

const PrizeCard = ({
  prize,
  onExchange,
  isAcquired,
  viewOnly = false,
  canAfford = true,
  requiresAuth = false,
}: {
  prize: Prize;
  onExchange: () => void;
  isAcquired: boolean;
  viewOnly?: boolean;
  canAfford?: boolean;
  requiresAuth?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleExchangeClick = (e: React.MouseEvent) => {
    if (viewOnly || isAcquired || !canAfford) return;
    if (requiresAuth) {
      setIsAuthModalOpen(true);
      document.body.classList.add("modal-open");
      return;
    }
    e.stopPropagation();
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const handleConfirm = () => {
    onExchange();
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleExchangeClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div
      className={`prize-card 
        ${isAcquired ? "prize-card--acquired" : ""} 
        ${viewOnly ? "prize-card--view-only" : ""}
        ${!canAfford && !requiresAuth ? "prize-card--unaffordable" : ""}`}
      onClick={handleExchangeClick}
      onKeyDown={handleKeyDown}
    >
      <div className="prize-card__content">
        <div className="prize-card__image-container">
          <img
            src={prize.image ? prize.image : logoWG}
            alt={prize.name}
            className="prize-card__image"
          />
        </div>
        <h3 className="prize-card__title">{prize.name}</h3>

        <div className="prize-card__points">
          <span className="prize-card__points-value">
            {prize.exchange_price}
          </span>
          <img src={coin} className="prize-coin" alt="coin" />
        </div>
      </div>

      <div className="prize-card__description">
        <p>{prize.description}</p>
      </div>

      {isModalOpen && (
        <PrizeExchangeModal
          prizeName={prize.name}
          prizeCost={prize.exchange_price}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {isAuthModalOpen && <PrizeAuthModal onClose={handleAuthModalClose} />}
      {isAcquired && (
        <div className="prize-card__acquired-overlay">
          <span>Déjà acquis</span>
        </div>
      )}
      {!canAfford && !isAcquired && (
        <div className="prize-card__unaffordable-overlay">
          <span>Points insuffisants</span>
        </div>
      )}
    </div>
  );
};

export default PrizeCard;
