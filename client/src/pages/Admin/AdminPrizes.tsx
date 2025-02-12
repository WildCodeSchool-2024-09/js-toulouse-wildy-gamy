import { useState } from "react";
import AdminItemGrid from "../../components/admin/AdminItemGrid";
import AdminLayout from "../../components/admin/AdminLayout";
import ModalAdminPrize from "../../components/admin/ModalAdminPrize";
import { useAdminData } from "../../components/admin/useAdminData";
import type { Prize } from "../../services/types";
import "../../styles/admin/AdminPrizes.css";
import "../../styles/admin/AdminCommon.css";

const DEFAULT_PRIZE: Prize = {
  id: 0,
  name: "",
  description: "",
  image: "",
  exchange_price: 0,
  is_available: true,
};

const AdminPrizes = () => {
  const {
    data: prizes,
    loading,
    error,
    deleteItem,
    updateItem,
    addItem,
    updateAvailability,
  } = useAdminData<Prize>({
    fetchUrl: "/api/prizes",
    loadingMessage: "Ouverture du coffre au trésor... 🎁",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize>(DEFAULT_PRIZE);
  const [modalMode, setModalMode] = useState<"edit" | "add">("add");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEditClick = (prize: Prize) => {
    setModalMode("edit");
    setSelectedPrize({
      ...prize,
      description: prize.description || "",
      image: prize.image || "",
      exchange_price: prize.exchange_price,
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedPrize(DEFAULT_PRIZE);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleSave = async (prizeData: {
    name: string;
    description: string;
    image: File | string;
    exchange_price?: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", prizeData.name);
      formData.append("description", prizeData.description);
      formData.append("exchange_price", prizeData.exchange_price || "0");

      if (prizeData.image instanceof File) {
        formData.append("image", prizeData.image);
      } else if (typeof prizeData.image === "string") {
        formData.append("image", prizeData.image);
      }

      if (modalMode === "add") {
        const newPrize = await addItem(formData);
        if (newPrize) {
          setIsModalOpen(false);
        }
      } else {
        await updateItem(selectedPrize.id, formData);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setLocalError(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-page">
        <div className="admin-loading-message">
          Ouverture du coffre au trésor... 🎁
        </div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="admin-loading-page">
        <div className="admin-error-message">{error}</div>
      </div>
    );
  }

  return (
    <AdminLayout
      showAddButton={true}
      onAddClick={handleAddClick}
      containerClassName="adminprizes-container"
      contentClassName="adminprizes-content"
      logoClassName="adminprizes-logo"
    >
      <div className="admingrid-card">
        {prizes?.map((prize) => (
          <AdminItemGrid
            key={prize.id}
            id={prize.id}
            type="prize"
            prize={prize}
            onAvailabilityChange={updateAvailability}
            onEdit={handleEditClick}
            onDelete={deleteItem}
          />
        ))}
      </div>

      <ModalAdminPrize
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prizeData={{
          ...selectedPrize,
          description: selectedPrize.description || "",
          image: selectedPrize.image || "",
          exchange_price: selectedPrize.exchange_price?.toString() || "0",
        }}
        onSave={handleSave}
        mode={modalMode}
      />
    </AdminLayout>
  );
};

export default AdminPrizes;
