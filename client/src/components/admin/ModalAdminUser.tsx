import type React from "react";
import { useEffect, useState } from "react";
import type { ModalProps, UserSaveData } from "../../services/types";
import "../../styles/admin/ModalAdminUser.css";

type Errors = {
  name?: string;
  firstname?: string;
  email?: string;
  username?: string;
  phone_number?: string;
  profile_pic?: string;
};

const ModalAdminUser: React.FC<ModalProps<UserSaveData>> = ({
  isOpen,
  onClose,
  userData,
  onSave,
}) => {
  if (!isOpen) return null;
  const [name, setName] = useState(userData?.name || "");
  const [firstname, setFirstname] = useState(userData?.firstname || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [phone_number, setPhoneNumber] = useState(userData?.phone_number || "");
  const [profile_pic, setProfilePic] = useState(userData?.profile_pic || "");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFirstname(userData.firstname || "");
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setPhoneNumber(userData.phone_number || "");
      setProfilePic(userData.profile_pic || "");
    }
  }, [userData]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!firstname.trim()) {
      newErrors.firstname = "Le prénom est requis";
    }

    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    }

    if (!username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }

    if (!phone_number.trim()) {
      newErrors.phone_number = "Le numéro de téléphone est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name,
        firstname,
        email,
        username,
        phone_number,
        profile_pic,
        is_admin: userData?.is_admin || false,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-admin-user modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClose();
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <h2 className="edit-modal-title">Modifier l'utilisateur</h2>

        <div className="edit-modal-content">
          <div className="profile-section">
            <div className="current-profile-image">
              {profile_pic ? (
                <img src={profile_pic} alt="Profile" />
              ) : (
                <div className="no-image" />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="profile_pic" className="edit-modal-label">
                Photo de profil
              </label>
              <input
                type="text"
                id="profile_pic"
                value={profile_pic}
                onChange={(e) => setProfilePic(e.target.value)}
                className="edit-modal-input"
                placeholder="URL de l'image"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstname" className="edit-modal-label">
                Prénom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className={`edit-modal-input ${errors.firstname ? "input-error" : ""}`}
              />
              {errors.firstname && (
                <span className="error-message">{errors.firstname}</span>
              )}
            </div>

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
            </div>

            <div className="form-group">
              <label htmlFor="username" className="edit-modal-label">
                Nom d'utilisateur <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`edit-modal-input ${errors.username ? "input-error" : ""}`}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="edit-modal-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`edit-modal-input ${errors.email ? "input-error" : ""}`}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number" className="edit-modal-label">
                Numéro de téléphone <span className="required">*</span>
              </label>
              <input
                type="text"
                id="phone_number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`edit-modal-input ${errors.phone_number ? "input-error" : ""}`}
              />
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
    </div>
  );
};
export default ModalAdminUser;
