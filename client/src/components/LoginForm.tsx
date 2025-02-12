import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from "../components/ResetPasswordModal";
import { useAuth } from "../services/authContext";
import BlurredBackground from "./BlurredBackground";
import ContactModal from "./ContactModal";
import "../styles/LoginForm.css";

interface LoginFormProps {
  resetToken?: string;
}

export default function LoginForm({ resetToken }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    stay_connected: false,
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(!!resetToken);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.status === 403) {
        setShowContactModal(true);
        setIsLoading(false);
        return;
      }

      if (response.ok && data.user) {
        setAuth(data);

        setTimeout(() => {
          setIsLoading(false);
          navigate(data.user.is_admin === 1 ? "/admin" : "/user_profile", {
            replace: true,
          });
        }, 100);
      } else {
        setError(data.error || "Identifiants invalides");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Une erreur est survenue lors de la connexion");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <BlurredBackground>
        <h1 className="login__title">SE CONNECTER</h1>

        {error && (
          <div className="login__error" aria-label="alert">
            {error}
          </div>
        )}

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <label className="login__label" htmlFor="email">
              Adresse email <span className="login__required">*</span>
            </label>
            <div className="login__input-wrapper">
              <input
                className="login__input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ex : lorem.ipsum@gmail.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">
              Votre mot de passe <span className="login__required">*</span>
            </label>
            <div className="login__input-wrapper password-input-wrapper">
              <input
                className="login__input"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="xxxxxxx"
                required
                minLength={6}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="login__remember">
            <label className="login__remember-label">
              <input
                type="checkbox"
                className="login__remember-input"
                id="stay_connected"
                name="stay_connected"
                checked={formData.stay_connected}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              Rester connecté
            </label>
          </div>

          <button className="login__submit" type="submit" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="login__links">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="forgot-password"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>
      </BlurredBackground>

      <div className="login__signup-container">
        <hr className="login__signup-line" />
        <span className="login__signup">
          {" "}
          <p className="create-account">ou créer votre compte</p>
        </span>
        <hr className="login__signup-line" />
      </div>

      <ContactModal
        title="Compte suspendu"
        message="Votre compte a été suspendu. Pour plus d'informations ou pour contester cette décision, veuillez contacter l'administrateur via le formulaire de contact."
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        token={resetToken}
      />
    </div>
  );
}
