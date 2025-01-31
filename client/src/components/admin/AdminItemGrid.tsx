import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import {
  Ban,
  CircleUser,
  Coins,
  Crown,
  Eye,
  EyeClosed,
  PencilLine,
  Phone,
  Sparkles,
  Tickets,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import logoWG from "../../assets/images/logo_wildy_gamy.png";
import type { Game, Prize, User } from "../../services/types";
import "../../styles/admin/AdminCommon.css";

interface AdminItemGridProps<T> {
  id: number;
  type: "game" | "prize" | "user";
  game?: T extends Game
    ? Omit<T, "description" | "image"> & {
        description?: string;
        image?: string;
      }
    : never;
  prize?: T extends Prize ? T : never;
  user?: T extends User ? T : never;
  onAvailabilityChange?: (id: number, isAvailable: boolean) => void;
  onEdit?: (item: T) => void;
  onUpdate?: (
    id: number,
    data: {
      name: string;
      description: string;
      image: string;
      price?: string;
      exchange_price?: string;
    },
  ) => void;
  onDelete?: (id: number) => void;
  onBan?: (id: number) => void;
  isBanned?: boolean;
  isAdmin?: boolean;
  onAdmin?: (id: number) => void;
  isNew?: boolean;
  onNew?: (id: number) => void;
}

const AdminItemGrid = <T extends Game | Prize | User>({
  id,
  type,
  game,
  prize,
  user,
  onAvailabilityChange,
  onEdit,
  onDelete,
  onBan,
  isBanned,
  onAdmin,
  isAdmin,
  onNew,
  isNew,
}: AdminItemGridProps<T>) => {
  const item = type === "game" ? game : type === "prize" ? prize : user;
  const [isAvailable, setIsAvailable] = useState(
    (item as Game | Prize)?.is_available ?? true,
  );
  if (!item) return null;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        `🎮 Suppression de ${
          type === "game" ? "jeu" : "lot"
        } - Cette action est irréversible. Confirmer ?`,
      )
    ) {
      onDelete?.(id);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit && item) {
      onEdit(item as T);
    }
  };

  const handleAvailabilityChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(id, newAvailability);
    }
  };

  const handleBan = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const message = isBanned
      ? "🔓 Êtes-vous sûr de vouloir débannir cet utilisateur ?"
      : "🚫 Êtes-vous sûr de vouloir bannir cet utilisateur ?";
    if (window.confirm(message)) {
      onBan?.(id);
    }
  };

  const handleAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const message = isAdmin
      ? "🔓 Êtes-vous sûr de vouloir retirer les droits d'administrateur à cet utilisateur ?"
      : "🚫 Êtes-vous sûr de vouloir donner les droits d'administrateur à cet utilisateur ?";
    if (window.confirm(message)) {
      onAdmin?.(id);
    }
  };

  const handleNew = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const message = isNew
      ? "🎪 Le show est terminé, on retire l'étiquette nouveau ?"
      : "✨ Hop hop hop ! On met ce jeu sous les projecteurs ?";
    if (window.confirm(message) && onNew) {
      onNew(id);
    }
  };

  if (type === "user") {
    return (
      <div
        className={`admincard-content ${
          isBanned
            ? "admincard-content-unavailable-user"
            : "admincard-content-available-user"
        } ${isAdmin ? "is-admin" : ""}`}
      >
        <div className="admincard-content-info-user">
          <img
            className="profile_pic"
            src={(item as User).profile_pic || logoWG}
            alt={item.name}
          />
          <div className="adminCard-info">
            <h3 className="adminCard-name">
              {(item as User).firstname} {item.name}
            </h3>

            <div className="adminCard-user-info">
              <div className="adminCard-username">
                <CircleUser className="username-icone" size={15} />
                <span>{(item as User).username}</span>
              </div>
              <div className="adminCard-phone">
                <Phone className="phone-icone" size={15} />
                <span>{(item as User).phone_number || "Non renseigné"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="adminCard-points">
          <div className="adminCard-points-user">
            <span>{(item as User).total_points}</span>
            <Crown size={16} />
          </div>
          <div className="adminCard-currentpoint-user">
            <span>{(item as User).current_points}</span>
            <Tickets size={16} />
          </div>
        </div>

        <div className="admincard-buttons-user">
          {onBan && (
            <button
              type="button"
              className="admincard-button"
              onClick={handleBan}
              title={
                isBanned ? "Débannir l'utilisateur" : "Bannir l'utilisateur"
              }
            >
              <Ban className={`admingrid-ban ${isBanned ? "banned" : ""}`} />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              className="admincard-button edit-button"
              onClick={handleEdit}
              title="Modifier"
            >
              <PencilLine className="admingrid-pencil" />
            </button>
          )}
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isAdmin}
                  name="isAdmin"
                  onChange={handleAdmin}
                  color="secondary"
                />
              }
              label="Admin"
            />
          </FormGroup>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`admincard-content ${type === "prize" ? "prizecard-content" : ""} ${
        !isAvailable
          ? "admincard-content-unavailable"
          : "admincard-content-available"
      }`}
    >
      <div
        className={
          type === "game" ? "admincard-content-info" : "admincard-content-info"
        }
      >
        <img
          className={type === "game" ? "gamecard-image" : "pricecard-img"}
          src={"image" in item ? item.image || logoWG : logoWG}
          alt={item.name}
        />
        <div className="adminCard-info">
          <h3 className="adminCard-name">{item.name}</h3>
        </div>
      </div>

      <div className="adminCard-prices">
        {type === "game" ? (
          <div className="adminCard-prices-game">
            <span>{(item as Game).price}</span>
            <Coins size={16} />
          </div>
        ) : (
          <div className="adminCard-prices-prize">
            <span>{(item as Prize).exchange_price}</span>
            <Tickets size={16} />
          </div>
        )}
      </div>

      <div className="admincard-buttons">
        {type === "game" && onNew && (
          <button
            type="button"
            className="admincard-button"
            onClick={handleNew}
            title={isNew ? "Retirer le tag nouveau" : "Mettre en avant"}
          >
            <Sparkles
              className={
                isNew ? "admingrid-sparkles-new" : "admingrid-sparkles"
              }
            />
          </button>
        )}
        {onAvailabilityChange && (
          <button
            type="button"
            onClick={handleAvailabilityChange}
            className="admincard-button"
            title={isAvailable ? "Rendre invisible" : "Rendre visible"}
          >
            {isAvailable ? (
              <Eye className="admingrid-eye" />
            ) : (
              <EyeClosed className="admingrid-eye" />
            )}
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            className="admincard-button edit-button"
            onClick={handleEdit}
            title="Modifier"
          >
            <PencilLine className="admingrid-pencil" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="admincard-button trash-button"
            onClick={handleDelete}
            title="Supprimer"
          >
            <Trash2 className="admingrid-trash" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminItemGrid;
