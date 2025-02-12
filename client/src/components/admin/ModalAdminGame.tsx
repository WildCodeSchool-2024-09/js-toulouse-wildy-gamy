import type React from "react";
import { useEffect, useState } from "react";
import logoWG from "../../assets/images/logo_wildy_gamy.png";
import type { GameSaveData, ModalProps } from "../../services/types";
import BlurredBackground from "../BlurredBackground";
import "../../styles/admin/ModalAdmin.css";

type Errors = {
  name?: string;
  description?: string;
  image?: string;
  price?: string;
};

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

const ModalAdminGame: React.FC<ModalProps<GameSaveData>> = ({
  isOpen,
  onClose,
  gameData,
  onSave,
  mode,
}) => {
  const [name, setName] = useState(gameData?.name || "");
  const [description, setDescription] = useState(gameData?.description || "");
  const [imageFile, setImageFile] = useState<string | File>(
    gameData?.image || "",
  );
  const [price, setPrice] = useState(gameData?.price?.toString() || "");
  const [errors, setErrors] = useState<Errors>({});
  const [previewUrl, setPreviewUrl] = useState<string>(
    typeof gameData?.image === "string" ? gameData.image : logoWG,
  );
  const [isLoading] = useState(false);

  useEffect(() => {
    if (gameData) {
      setName(gameData.name || "");
      setDescription(gameData.description || "");
      setPreviewUrl(
        gameData.image instanceof File
          ? URL.createObjectURL(gameData.image)
          : gameData.image || logoWG,
      );
      setPrice(gameData.price?.toString() || "");
    }
  }, [gameData]);

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl !== logoWG &&
        previewUrl !== gameData?.image
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, gameData?.image]);

  const handleFileChange = (e: FileChangeEvent) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "L'image ne doit pas dépasser 5MB",
        }));
        e.target.value = "";
        return;
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Seuls les fichiers PNG et JPG sont autorisés",
        }));
        e.target.value = "";
        return;
      }

      if (
        previewUrl &&
        previewUrl !== logoWG &&
        previewUrl !== gameData?.image
      ) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPrevieuwUrl = URL.createObjectURL(file);
      setPreviewUrl(newPrevieuwUrl);
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (!price.trim()) {
      newErrors.price = "Le prix est requis";
    } else if (!/^\d+$/.test(price.trim())) {
      newErrors.price = "Le prix doit être un nombre";
    }

    if (mode === "add" && !imageFile && previewUrl === logoWG) {
      newErrors.image = "L'image est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name,
        description,
        image: imageFile || gameData?.image || "",
        price,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <BlurredBackground>
          <div className="edit-modal">
            <h2 className="edit-modal-title">
              {mode === "edit" ? "MODIFIER LE JEU" : "AJOUTER UN JEU"}
            </h2>
            <div className="edit-modal-content">
              <div className="image-section">
                <div className="form-group">
                  <label htmlFor="image" className="edit-modal-label">
                    Image du jeu
                  </label>
                  <div className="image-input-container">
                    <input
                      type="file"
                      id="image"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className={`edit-modal-input ${errors.image ? "input-error" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.image && (
                    <span className="error-message">{errors.image}</span>
                  )}
                </div>
                <div className="image-preview">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        className="image-prize-modal"
                        alt="Prévisualisation"
                      />
                    </>
                  ) : (
                    <div className="no-image">Aperçu de l'image</div>
                  )}
                </div>
              </div>
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" className="edit-modal-label">
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`edit-modal-input ${errors.name ? "input-error" : ""}`}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="edit-modal-label">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`edit-modal-textarea ${errors.description ? "input-error" : ""}`}
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="price" className="edit-modal-label">
                    Prix <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`edit-modal-input ${errors.price ? "input-error" : ""}`}
                  />
                  {errors.price && (
                    <span className="error-message">{errors.price}</span>
                  )}
                </div>
              </div>

              <div className="edit-modal-buttons">
                <button
                  type="button"
                  onClick={handleSave}
                  className="edit-modal-save"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="edit-modal-cancel"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </BlurredBackground>
      </div>
    </div>
  );
};

export default ModalAdminGame;
