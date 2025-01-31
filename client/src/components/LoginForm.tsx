import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../services/authContext";
import BlurredBackground from "./BlurredBackground";
import "../styles/LoginForm.css";

interface LoginFormData {
  email: string;
  password: string;
  stayConnected: boolean;
  [key: string]: string | boolean;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    stayConnected: false,
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setError("");
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      const response = await api.post("/api/login", formData);

      if (!response) {
        throw new Error("Erreur de connexion");
      }

      if (response.status === 200) {
        const data = await response.json();
        setAuth({
          user: data.user,
          token: "",
        });
        navigate("/user_profile");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
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
            <div className="login__input-wrapper">
              <input
                className="login__input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="xxxxxxx"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="login__remember">
            <label className="login__remember-label">
              <input
                type="checkbox"
                className="login__remember-input"
                id="stayConnected"
                name="stayConnected"
                checked={formData.stayConnected}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              Rester connecté
            </label>
          </div>

          <button
            className="login__submit"
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="login__links">
            <a href="/forgot-password" className="login__forgot-link">
              Mot de passe oublié ?
            </a>
          </div>
        </form>
      </BlurredBackground>

      <div className="login__signup-container">
        <hr className="login__signup-line" />
        <span className="login__signup">
          Ou{" "}
          <a href="/create-account" className="login__signup-link">
            créer votre compte
          </a>
        </span>
        <hr className="login__signup-line" />
      </div>
    </div>
  );
}
