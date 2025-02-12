import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../services/authContext";
import "../styles/ChangePasswordModal.css";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
  userId,
}: PasswordChangeModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { auth } = useAuth() as unknown as {
    auth: { token: string };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Erreur lors du changement de mot de passe",
        );
      }

      onClose();
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      ("Mot de passe modifié avec succès");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="password-modal-overlay">
        <div className="password-modal-content">
          <button
            type="button"
            className="password-modal-close"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          <h2 className="password-modal-title">UN NOUVEAU DÉPART</h2>
          <p className="password-modal-subtitle">
            Changez régulièrement vos mots de passe
          </p>

          <form onSubmit={handleValidate} className="password-modal-form">
            {error && <div className="password-modal-error">{error}</div>}

            <div className="password-modal-field">
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Mot de passe actuel"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="password-modal-field">
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="password-modal-field">
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="password-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="password-modal-cancel"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="password-modal-submit"
              >
                {isLoading ? "Modification..." : "Valider"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirmModal && (
        <div className="alert-modal-admin-overlay">
          <div className="alert-modal-admin-content">
            <div className="alert-modal-admin-header">
              <h5 className="alert-modal-admin-title">Confirmation</h5>
            </div>
            <div className="alert-modal-admin-body">
              <p>Êtes-vous sûr de vouloir changer votre mot de passe ?</p>
            </div>
            <div className="alert-modal-admin-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
