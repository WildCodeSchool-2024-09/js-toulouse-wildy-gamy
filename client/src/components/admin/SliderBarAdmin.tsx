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
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext";
import "../../styles/admin/SliderBarAdmin.css";
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
  const { setAuth } = useAuth() as unknown as {
    setAuth: (auth: null) => void;
  };
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onClick?: () => void;
    onConfirm: () => void;
  } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

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
      onClick: () =>
        window.open("https://mail.google.com/mail/u/0/#inbox", "_blank"),
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

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/emails/unread`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Erreur fetch:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 300000);
    return () => clearInterval(interval);
  }, []);

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
          Vue visiteur
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
