import {
  CircleUserRound,
  Gamepad2,
  Gift,
  Home,
  Joystick,
  Store,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/authContext";
import "../styles/NavBar.css";
import homeIcon from "../assets/images/home-icon.svg";
import loginIcon from "../assets/images/login-icon.svg";
import logoWG from "../assets/images/logo_wildy_gamy.png";

const menuItems = [
  { id: 1, to: "/", text: "Accueil", icon: Home },
  { id: 2, to: "/about_us", text: "Qui sommes-nous ?", icon: Store },
  { id: 3, to: "/play", text: "Jeu en ligne", icon: Gamepad2 },
  { id: 4, to: "/ranking", text: "Classement", icon: Trophy },
  { id: 5, to: "/games", text: "Liste des jeux", icon: Joystick },
  { id: 6, to: "/prizes", text: "Récompenses", icon: Gift },
];

export default function NavBar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { auth } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      {/* Version Mobile */}
      <nav className="mobile-nav">
        <div className="nav-bar-left">
          <Link className="nav-bar-link" to="/">
            <img className="home-icon" src={homeIcon} alt="Home" />
          </Link>
        </div>

        <div className="nav-bar-separator" />

        <div className="nav-bar-center">
          <button
            ref={buttonRef}
            type="button"
            className={`burger-menu-button ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </div>

        <div className="nav-bar-separator" />

        <div className="nav-bar-right">
          {auth?.user?.profile_pic ? (
            <Link className="nav-bar-link" to="/user_profile">
              <img
                className="nav-profile-pic"
                src={auth.user.profile_pic}
                alt="Profile"
              />
            </Link>
          ) : (
            <Link className="nav-bar-link" to="/login">
              <img className="login-icon" src={loginIcon} alt="Login" />
            </Link>
          )}
        </div>

        <div
          ref={menuRef}
          className={`burger-menu-dropdown ${isMenuOpen ? "active" : ""}`}
        >
          <Link
            className="burger-menu-link"
            to="/about_us"
            onClick={toggleMenu}
          >
            Qui sommes-nous ?
          </Link>
          <Link className="burger-menu-link" to="/play" onClick={toggleMenu}>
            Jeu en ligne
          </Link>
          <Link className="burger-menu-link" to="/ranking" onClick={toggleMenu}>
            Classement
          </Link>
          <Link className="burger-menu-link" to="/games" onClick={toggleMenu}>
            Liste des jeux
          </Link>
          <Link className="burger-menu-link" to="/prizes" onClick={toggleMenu}>
            Récompenses
          </Link>
        </div>
      </nav>

      {/* Version Desktop  */}
      <nav className="desktop-nav">
        <div className="desktop-nav-container">
          <img
            src={logoWG}
            alt="logo Wildy Gamy"
            className="desktop-nav-logo"
          />
          <div className="desktop-nav-links">
            {menuItems.map((item) => (
              <Link key={item.id} className="desktop-nav-link" to={item.to}>
                <item.icon className="desktop-nav-icon" />{" "}
                <span id="desktop-nav-text">{item.text}</span>
              </Link>
            ))}
            {auth?.user?.profile_pic ? (
              <Link className="desktop-nav-link" to="/user_profile">
                <img
                  className="nav-profile-pic"
                  src={auth.user.profile_pic}
                  alt="Profile"
                />
              </Link>
            ) : (
              <Link className="desktop-nav-link" to="/login">
                <CircleUserRound className="desktop-nav-icon" />
                <span id="desktop-nav-text">Se connecter</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
