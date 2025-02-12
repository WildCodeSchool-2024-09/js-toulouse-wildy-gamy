import type React from "react";
import { useEffect, useState } from "react";
import bin from "../assets/images/bin.svg";
import BlurredBackground from "./BlurredBackground";
import "../styles/CreateLogin.css";
import { Eye, EyeOff } from "lucide-react";
import DeleteConfirmModal from "./DeleteAccountConfirmModal";

interface FormData {
  name: string;
  firstname: string;
  phone_number: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

interface ApiError {
  error?: string;
  details?: string;
}

export default function CreateLogin() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    firstname: "",
    phone_number: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: FileChangeEvent) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille de l'image ne doit pas dépasser 5MB");
        e.target.value = "";
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Veuillez sélectionner une image valide (JPG, JPEG ou PNG)");
        e.target.value = "";
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setProfilePic(file);
      setError("");
    }
  };

  const clearProfilePic = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setProfilePic(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById(
      "profile_pic",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const scrollToTop = () => {
    const titleElement = document.querySelector(".login-form-title");
    if (titleElement) {
      titleElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const newInvalidFields = new Set<string>();
    const errors: string[] = [];

    if (!formData.name.trim()) {
      newInvalidFields.add("name");
      errors.push("Le nom est requis");
    }
    if (!formData.firstname.trim()) {
      newInvalidFields.add("firstname");
      errors.push("Le prénom est requis");
    }
    if (!formData.email.trim()) {
      newInvalidFields.add("email");
      errors.push("L'adresse e-mail est requise");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newInvalidFields.add("email");
        errors.push("L'adresse e-mail n'est pas valide");
      }
    }

    if (!formData.username.trim()) {
      newInvalidFields.add("username");
      errors.push("Le pseudo est requis");
    } else if (formData.username.length > 13) {
      newInvalidFields.add("username");
      errors.push("Le pseudo doit contenir 12 caractères maximum");
    }

    if (!formData.password) {
      newInvalidFields.add("password");
      errors.push("Le mot de passe est requis");
    } else if (formData.password.length < 6) {
      newInvalidFields.add("password");
      errors.push("Le mot de passe doit contenir au moins 6 caractères");
    }

    if (!formData.confirm_password) {
      newInvalidFields.add("confirm_password");
      errors.push("La confirmation du mot de passe est requise");
    }
    if (
      formData.password &&
      formData.confirm_password &&
      formData.password !== formData.confirm_password
    ) {
      newInvalidFields.add("password");
      newInvalidFields.add("confirm_password");
      errors.push("Les mots de passe ne correspondent pas");
    }

    if (!profilePic) {
      newInvalidFields.add("profile_pic");
      errors.push("La photo de profil est requise");
    }

    if (!formData.phone_number.trim()) {
      newInvalidFields.add("phone_number");
      errors.push("Le numéro de téléphone est requis");
    }

    setInvalidFields(newInvalidFields);

    scrollToTop();

    if (errors.length > 0) {
      setError(errors.join("\n"));
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      for (const key of Object.keys(formData) as Array<keyof FormData>) {
        if (key !== "confirm_password") {
          submitData.append(key, formData[key]);
        }
      }

      if (profilePic) {
        submitData.append("profile_pic", profilePic);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        method: "POST",
        credentials: "include",
        body: submitData,
      });

      const data = (await response.json()) as ApiError;

      if (!response.ok) {
        if (data.error === "Cette adresse email est déjà utilisée") {
          newInvalidFields.add("email");
          setInvalidFields(newInvalidFields);
          setError(data.error);
        } else if (data.error === "Ce pseudo n'est pas disponible") {
          newInvalidFields.add("username");
          setInvalidFields(newInvalidFields);
          setError(data.error);
        } else {
          throw new Error(
            data.error ||
              data.details ||
              "Une erreur est survenue lors de la création du compte",
          );
        }
        scrollToTop();
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Erreur détaillée:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setInvalidFields((prev: Set<string>) => {
      const newInvalidFields = new Set(prev);
      newInvalidFields.delete(name);
      return newInvalidFields;
    });
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="login-form-container">
      <BlurredBackground>
        <h1 className="login-form-title">CRÉER VOTRE COMPTE</h1>

        {error && (
          <div className="error-message" aria-live="assertive">
            {error.split("\n").map((err) => (
              <div key={err}>{err}</div>
            ))}
          </div>
        )}

        {success && (
          <div className="success-message" aria-live="polite">
            Compte créé avec succès !
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulaire de création de compte"
        >
          <div className="login-text">
            <label className="login-label" htmlFor="name">
              Nom{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper">
              <input
                className={`login-input ${invalidFields.has("name") ? "invalid" : ""}`}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ex: Lassalle"
                required
                aria-required="true"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-text">
            <label className="login-label" htmlFor="firstname">
              Prénom{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper">
              <input
                className={`login-input ${invalidFields.has("firstname") ? "invalid" : ""}`}
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="ex: Jean"
                required
                aria-required="true"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-text">
            <label className="login-label" htmlFor="phone_number">
              Numéro de téléphone{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper">
              <input
                className={`login-input ${invalidFields.has("phone_number") ? "invalid" : ""}`}
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="ex: 06 12 34 56 78"
                required
                aria-required="true"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-text">
            <label className="login-label" htmlFor="email">
              Adresse e-mail{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper">
              <input
                className={`login-input ${invalidFields.has("email") ? "invalid" : ""}`}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ex: jean.lassalle@example.fr"
                required
                aria-required="true"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-text">
            <label className="login-label" htmlFor="username">
              Pseudo{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper">
              <input
                className={`login-input ${invalidFields.has("username") ? "invalid" : ""}`}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Maximum 12 caractères"
                required
                aria-required="true"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-picture-container">
            <label className="login-text-picture" htmlFor="profile_pic">
              Photo de profil{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="login-picture-wrapper">
              <div
                className={`login-picture-input ${previewUrl ? "has-image" : ""} ${invalidFields.has("profile_pic") ? "invalid" : ""}`}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Prévisualisation du profil"
                    className="profile-preview"
                  />
                )}
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  required
                  aria-required="true"
                  aria-label="Sélectionner une photo de profil"
                  disabled={isLoading}
                />
              </div>
              {previewUrl && (
                <button
                  type="button"
                  className="login-bin"
                  onClick={clearProfilePic}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      clearProfilePic();
                    }
                  }}
                >
                  <img src={bin} alt="icône supprimer" />
                </button>
              )}
            </div>
          </div>

          <div className="login-text">
            <label className="login-label" htmlFor="password">
              Mot de passe{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                className={`login-input ${invalidFields.has("password") ? "invalid" : ""}`}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 caractères"
                required
                aria-required="true"
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="password-icon" />
                ) : (
                  <Eye className="password-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="login-text">
            <label className="login-label" htmlFor="confirm_password">
              Confirmer le mot de passe{" "}
              <span className="login-asterisk" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                className={`login-input ${invalidFields.has("confirm_password") ? "invalid" : ""}`}
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Confirmez votre mot de passe"
                required
                aria-required="true"
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Masquer la confirmation du mot de passe"
                    : "Afficher la confirmation du mot de passe"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="password-icon" />
                ) : (
                  <Eye className="password-icon" />
                )}
              </button>
            </div>
          </div>

          <button
            className="login-submit-button"
            type="submit"
            disabled={isLoading || success}
            aria-disabled={isLoading || success}
          >
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </button>
          <DeleteConfirmModal
            isOpen={success}
            onClose={() => setSuccess(false)}
            onConfirm={() => {
              window.scrollTo(0, 0);
              window.location.reload();
            }}
            title="Bravo"
            message="Compte créé avec succès !"
            showCloseButton={false}
          />
        </form>
      </BlurredBackground>
    </div>
  );
}
