import type React from "react";
import { useState } from "react";
import logoWG from "../../assets/images/logo_wildy_gamy.png";
import SliderBarAdmin from "../admin/SliderBarAdmin";
import "../../styles/admin/AdminCommon.css";
import { Link } from "react-router-dom";
import AddButton from "../admin/AddButton";

interface AdminLayoutProps {
  children: React.ReactNode;
  onAddClick?: () => void;
  showAddButton?: boolean;
  containerClassName?: string;
  contentClassName?: string;
  logoClassName?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  onAddClick,
  showAddButton = true,
  containerClassName = "admingames-container",
  contentClassName = "admingames-content",
  logoClassName = "admingames-logo",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="admin-dashboard">
      <div className={containerClassName}>
        <Link to={"/admin"}>
          <img src={logoWG} alt="logo" className={logoClassName} />
        </Link>
        <SliderBarAdmin
          isOpen={isOpen}
          onToggle={setIsOpen}
          onClose={() => setIsOpen(false)}
        />

        <div className={`main-content ${isOpen ? "main-content-shifted" : ""}`}>
          <div className={contentClassName}>{children}</div>
        </div>

        {showAddButton && onAddClick && <AddButton onClick={onAddClick} />}
      </div>
    </div>
  );
};

export default AdminLayout;
