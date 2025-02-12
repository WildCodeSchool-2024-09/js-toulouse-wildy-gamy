import { Plus } from "lucide-react";
import "../../styles/admin/AddButton.css";

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="add-button"
      aria-label="Ajouter"
      onClick={onClick}
    >
      <Plus size={40} />
    </button>
  );
};

export default AddButton;
