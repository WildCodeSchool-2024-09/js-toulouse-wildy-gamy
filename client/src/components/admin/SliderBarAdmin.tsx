import { Joystick, LogOut, Menu, Trophy, Users, View, X } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/admin/SliderBarAdmin.css";

interface SliderBarAdminProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const menuItems = [
  {
    id: 1,
    title: "Utilisateurs",
    icon: <Users className="iconItem" />,
    link: "/admin/users",
  },
  {
    id: 2,
    title: "Jeux",
    icon: <Joystick className="iconItem" />,
    link: "/admin/games",
  },
  {
    id: 3,
    title: "Lots",
    icon: <Trophy className="iconItem" />,
    link: "/admin/prizes",
  },
];

function SliderBarAdmin({ isOpen, onToggle }: SliderBarAdminProps) {
  const handleLogout = () => {
    alert("logout");
  };
  const handleClick = () => {
    window.open("/", "_blank", "noopener,noreferrer");
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
        {menuItems.map((item) => (
          <Link key={item.id} to={item.link} className="menu-item">
            {item.icon}
            <span
              className={`menu-item-text ${!isOpen && "menu-item-text-hidden"}`}
            >
              {item.title}
            </span>
          </Link>
        ))}
      </div>
      <button type="button" className="vueUser-button" onClick={handleClick}>
        <View className="iconItem" />
        <span className="menu-item-text">Vue visiteur</span>
      </button>

      <button type="button" onClick={handleLogout} className="logout-button">
        <LogOut className="iconItem" />
        <span
          className={`menu-item-text ${!isOpen && "menu-item-text-hidden"}`}
        >
          Déconnexion
        </span>
      </button>
    </div>
  );
}

export default SliderBarAdmin;
