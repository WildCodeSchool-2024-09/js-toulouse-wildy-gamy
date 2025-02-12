import "../../styles/admin/AdminHome.css";
import { Joystick, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoWG from "../../assets/images/logo_wildy_gamy.png";
import SliderBarAdmin from "../../components/admin/SliderBarAdmin";

function AdminHome() {
  const [isOpen, setIsOpen] = useState(false);
  const handleSidebarToggle = (open: boolean) => {
    setIsOpen(open);
  };
  const navigation = useNavigate();

  return (
    <div className="adminhome-container">
      <Link to="/">
        <img src={logoWG} alt="logo" className="adminhome-logo" />
      </Link>
      <SliderBarAdmin
        isOpen={isOpen}
        onToggle={handleSidebarToggle}
        onClose={() => setIsOpen(false)}
      />
      <div className={`main-content ${isOpen ? "main-content-shifted" : ""}`}>
        <div className="welcome-container">
          <h1 className="welcome-title">
            BIENVENUE DANS L'ESPACE ADMINISTRATEUR
          </h1>

          <div className="welcome-content">
            <div className="features-list">
              <div
                onClick={() => {
                  navigation("/admin/users");
                }}
                onKeyDown={() => {
                  navigation("/admin/users");
                }}
                className="feature-item"
              >
                <Users className="feature-icon" />
                <h2>Utilisateurs</h2>
                <p>Gérez les comptes utilisateurs :</p>
                <ul>
                  <li>Ajout de nouveaux utilisateurs</li>
                  <li>Modification des comptes existants</li>
                  <li>Suppression des comptes</li>
                </ul>
              </div>

              <div
                onClick={() => {
                  navigation("/admin/games");
                }}
                onKeyDown={() => {
                  navigation("/admin/games");
                }}
                className="feature-item"
              >
                <Joystick className="feature-icon" />
                <h2>Jeux</h2>
                <p>Administration des jeux :</p>
                <ul>
                  <li>Création de nouveaux jeux</li>
                  <li>Mise à jour des jeux existants</li>
                  <li>Suppression des jeux</li>
                </ul>
              </div>

              <div
                onClick={() => {
                  navigation("/admin/prizes");
                }}
                onKeyDown={() => {
                  navigation("/admin/prizes");
                }}
                className="feature-item"
              >
                <Trophy className="feature-icon" />
                <h2>Lots</h2>
                <p>Gestion des lots à gagner :</p>
                <ul>
                  <li>Ajout de nouveaux lots</li>
                  <li>Modification des lots existants</li>
                  <li>Retrait des lots</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
