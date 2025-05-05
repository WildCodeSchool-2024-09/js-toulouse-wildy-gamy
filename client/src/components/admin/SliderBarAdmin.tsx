import {
  Joystick,
  LogOut,
  Mail,
  Menu,
  Trophy,
  Users,
  View,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext";
import "../../styles/admin/SliderBarAdmin.css";
import { toast } from "react-toastify";
import AlertModalAdmin from "../AlertModal";

interface MenuItem {
  id: number;
  title: string;
  icon: JSX.Element;
  link?: string;
  onClick?: () => void;
}

interface SliderBarAdminProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onClose: () => void;
}

function SliderBarAdmin({ isOpen, onToggle, onClose }: SliderBarAdminProps) {
  const navigate = useNavigate();
  const { user, setAuth } = useAuth() as unknown as {
    user: { is_admin: boolean } | null;
    setAuth: (auth: null) => void;
  };
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onClick?: () => void;
    onConfirm: () => void;
  } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fonction pour récupérer le nombre d'emails non lus
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/emails/unread`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503 && data.error) {
          if (user?.is_admin) {
            toast.warning(
              "Le service de messagerie est temporairement indisponible. Veuillez vérifier les informations d'authentification Gmail.",
              {
                position: "top-center",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                theme: "colored",
                style: {
                  background: "#FFA500",
                  color: "white",
                },
              },
            );
          }
        }
        // On continue en définissant unreadCount à 0
        setUnreadCount(0);
        return;
      }

      // Mettre à jour le unreadCount
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emails non lus:",
        error,
      );
      setUnreadCount(0);
    }
  }, [user]);

  // Effet pour le rafraîchissement périodique
  useEffect(() => {
    // Rafraîchir immédiatement au chargement
    fetchUnreadCount();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchUnreadCount, 30000);

    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval);
  }, [fetchUnreadCount]); // Dépendance sur fetchUnreadCount uniquement

  // Effet pour gérer la visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchUnreadCount();
      }
    };

    // Écouter les changements de visibilité
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchUnreadCount]);

  // Configuration des éléments du menu
  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: "Emails",
      icon: (
        <div className="icon-wrapper">
          <Mail className="iconItem" />
          {unreadCount > 0 && <div className="mail-badge">{unreadCount}</div>}
        </div>
      ),
      onClick: () => {
        window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
        setTimeout(fetchUnreadCount, 5000);
      },
    },
    {
      id: 2,
      title: "Utilisateurs",
      icon: <Users className="iconItem" />,
      link: "/admin/users",
    },
    {
      id: 3,
      title: "Jeux",
      icon: <Joystick className="iconItem" />,
      link: "/admin/games",
    },
    {
      id: 4,
      title: "Lots",
      icon: <Trophy className="iconItem" />,
      link: "/admin/prizes",
    },
  ];

  const logoutUser = () => {
    setAuth(null);
    onClose();
    navigate("/");
  };

  const handleLogout = () => {
    setModalConfig({
      title: "Déconnexion",
      message: "Êtes-vous sûr de vouloir vous déconnecter ?",
      onClick: () => {},
      onConfirm: logoutUser,
    });
  };

  const handleClick = () => {
    window.open("/", "_blank", "noopener,noreferrer");
  };

  const renderModal = () => {
    return ReactDOM.createPortal(
      <AlertModalAdmin
        title={modalConfig?.title || ""}
        message={modalConfig?.message || ""}
        visible={modalConfig !== null}
        onConfirm={modalConfig?.onConfirm || (() => {})}
        onClose={() => setModalConfig(null)}
      />,
      document.body,
    );
  };

  return (
    <div
      className={`adminhome-sidebar ${isOpen ? "adminhome-sidebar-open" : "adminhome-sidebar-close"}`}
    >
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        className="adminhome-button"
      >
        {isOpen ? (
          <X className="button-close" />
        ) : (
          <Menu className="button-open" />
        )}
      </button>

      <div className="adminhome-menu">
        {menuItems.map((item) =>
          item.link ? (
            <Link key={item.id} to={item.link} className="menu-item">
              {item.icon}
              <span
                className={`menu-item-text ${!isOpen && "menu-item-text-hidden"}`}
              >
                {item.title}
              </span>
            </Link>
          ) : (
            <div
              key={item.id}
              className="menu-item"
              onClick={item.onClick}
              onKeyUp={(e) => {
                if ((e.key === "Enter" || e.key === " ") && item.onClick) {
                  item.onClick();
                }
              }}
            >
              {item.icon}
              <span
                className={`menu-item-text ${!isOpen && "menu-item-text-hidden"}`}
              >
                {item.title}
              </span>
            </div>
          ),
        )}
      </div>

      <button type="button" className="vueUser-button" onClick={handleClick}>
        <View className="iconItem" />
        <span
          className={`menu-item-text ${!isOpen && "menu-item-text-hidden"}`}
        >
          Vue Utilisateur
        </span>
      </button>

      <button type="button" onClick={handleLogout} className="logout-button">
        <LogOut className="iconItem" />
        <span
          className={`menu-item-text ${!isOpen && "menu-item-text-hidden"}`}
        >
          Déconnexion
        </span>
      </button>
      {modalConfig !== null && renderModal()}
    </div>
  );
}

export default SliderBarAdmin;
