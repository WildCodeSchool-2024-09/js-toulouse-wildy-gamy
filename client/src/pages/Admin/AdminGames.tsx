import { useState } from "react";
import AdminItemGrid from "../../components/admin/AdminItemGrid";
import AdminLayout from "../../components/admin/AdminLayout";
import ModalAdminGame from "../../components/admin/ModalAdminGame";
import { useAdminData } from "../../components/admin/useAdminData";
import type { Game } from "../../services/types";
import "../../styles/admin/AdminGames.css";
import "../../styles/admin/AdminCommon.css";

const DEFAULT_GAME: Game = {
  id: 0,
  name: "",
  description: "",
  image: "",
  price: 0,
  is_available: true,
  is_new: false,
};

const AdminGames = () => {
  const {
    data: games,
    loading,
    error,
    updateItem,
    deleteItem,
    addItem,
    setData,
    updateAvailability,
  } = useAdminData<Game>({
    fetchUrl: "/api/games",
    loadingMessage: "Motivation des fantômes de Pac-Man...",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "add">("add");
  const [selectedGame, setSelectedGame] = useState<Game>(DEFAULT_GAME);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEditClick = (game: Game) => {
    setModalMode("edit");
    setSelectedGame({
      ...game,
      description: game.description || "",
      image: game.image || "",
      price: game.price,
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedGame(DEFAULT_GAME);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleSave = async (gameData: {
    name: string;
    description: string;
    image: File | string;
    price?: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", gameData.name);
      formData.append("description", gameData.description);
      formData.append("price", gameData.price || "0");
      formData.append("is_available", "1");

      if (gameData.image instanceof File) {
        formData.append("image", gameData.image);
      } else if (typeof gameData.image === "string") {
        formData.append("image", gameData.image);
      }

      if (modalMode === "add") {
        const newGame = await addItem(formData);
        if (newGame) {
          setIsModalOpen(false);
        }
      } else {
        await updateItem(selectedGame.id, formData);
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
          Motivation des fantômes de Pac-Man...
        </div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="admin-loading-page">
        <div className="admin-error-message">{error || localError}</div>
      </div>
    );
  }

  const handleNew = async (id: number) => {
    try {
      const game = games?.find((game) => game.id === id);
      if (!game) return;

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/games/${id}/new`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isNew: !game.is_new }),
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const updatedGames = games?.map((g) =>
        g.id === id ? { ...g, is_new: !g.is_new } : g,
      );
      if (updatedGames) {
        setData(updatedGames);
      }
    } catch (error) {
      console.error("Erreur lors de la modification du statut nouveau:", error);
    }
  };

  return (
    <AdminLayout
      showAddButton={true}
      onAddClick={handleAddClick}
      containerClassName="admingames-container"
      contentClassName="admingames-content"
      logoClassName="admingames-logo"
    >
      <div className="admingrid-card">
        {games?.map((game) => (
          <AdminItemGrid
            key={game.id}
            id={game.id}
            type="game"
            game={game}
            onAvailabilityChange={updateAvailability}
            onEdit={handleEditClick}
            onDelete={deleteItem}
            onNew={handleNew}
            isNew={game.is_new}
          />
        ))}
      </div>

      <ModalAdminGame
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameData={{
          ...selectedGame,
          description: selectedGame.description || "",
          image: selectedGame.image || "",
          price: selectedGame.price?.toString() || "0",
        }}
        onSave={handleSave}
        mode={modalMode}
      />
    </AdminLayout>
  );
};

export default AdminGames;
