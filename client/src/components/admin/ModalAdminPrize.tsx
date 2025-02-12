import type React from "react";
import { useEffect, useState } from "react";
import logoWG from "../../assets/images/logo_wildy_gamy.png";
import type { ModalProps, PrizeSaveData } from "../../services/types";
import BlurredBackground from "../BlurredBackground";
import "../../styles/admin/ModalAdmin.css";

type Errors = {
  name?: string;
  description?: string;
  image?: string;
  exchange_price?: string;
};

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

const ModalAdminPrize: React.FC<ModalProps<PrizeSaveData>> = ({
  isOpen,
  onClose,
  prizeData,
  mode,
  onSave,
}) => {
  const [name, setName] = useState(prizeData?.name || "");
  const [description, setDescription] = useState(prizeData?.description || "");
  const [exchange_price, setExchangePrice] = useState(
    prizeData?.exchange_price?.toString() || "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    typeof prizeData?.image === "string" ? prizeData.image : logoWG,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading] = useState(false);

  useEffect(() => {
    if (prizeData) {
      setName(prizeData.name || "");
      setDescription(prizeData.description || "");
      setPreviewUrl(
        prizeData.image instanceof File
          ? URL.createObjectURL(prizeData.image)
          : prizeData.image || logoWG,
      );
      setExchangePrice(prizeData.exchange_price?.toString() || "");
    }
  }, [prizeData]);

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl !== logoWG &&
        previewUrl !== prizeData?.image
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, prizeData?.image]);

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

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Veuillez sélectionner une image valide (JPG, JPEG ou PNG)",
        }));
        e.target.value = "";
        return;
      }

      if (
        previewUrl &&
        previewUrl !== logoWG &&
        previewUrl !== prizeData?.image
      ) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
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
    if (!exchange_price.trim()) {
      newErrors.exchange_price = "Le prix est requis";
    } else if (!/^\d+$/.test(exchange_price.trim())) {
      newErrors.exchange_price = "Le prix doit être un nombre entier";
    }
    if (mode === "add" && !imageFile && previewUrl === logoWG) {
      newErrors.image = "Une image est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name,
        description,
        image: imageFile || prizeData?.image || "",
        exchange_price,
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
              {mode === "edit" ? "MODIFIER LE LOT" : "AJOUTER UN LOT"}
            </h2>
            <div className="edit-modal-content">
              <div className="image-section">
                <div className="form-group">
                  <label htmlFor="image" className="edit-modal-label">
                    Image du lot
                  </label>
                  <div className="image-input-container">
                    <input
                      type="file"
                      id="image"
                      accept="image/jpeg,image/jpg,image/png"
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="exchange_price" className="edit-modal-label">
                    Prix d'échange <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="exchange_price"
                    value={exchange_price}
                    onChange={(e) => setExchangePrice(e.target.value)}
                    className={`edit-modal-input ${errors.exchange_price ? "input-error" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.exchange_price && (
                    <span className="error-message">
                      {errors.exchange_price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="edit-modal-buttons">
              <button
                type="button"
                onClick={handleSave}
                className="edit-modal-save"
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="edit-modal-cancel"
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
          </div>
        </BlurredBackground>
      </div>
    </div>
  );
};

export default ModalAdminPrize;
