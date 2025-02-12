import logoWG from "../assets/images/logo_wildy_gamy.png";
import "../styles/Games.css";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import wen from "../assets/images/wen.svg";
import GameCard from "../components/GameCard";

interface Game {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
}

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [valueInput, setValueInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/games/available`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux:", error);
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="games-page">
        <div className="games-page__loading">
          Scan des bornes d'arcade en cours...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-page">
        <div className="games-page__error">{error}</div>
      </div>
    );
  }

  const gamesFiltered = games.filter((game) =>
    game.name.toLowerCase().includes(valueInput.toLowerCase()),
  );

  const noResultMessages = [
    "🕹️ GAME OVER - Aucun jeu ne correspond à votre recherche 🕹️",
    "🎮 INSERT COIN - Pour essayer une nouvelle recherche 🎮",
    "🏆 HIGH SCORE: 0 RÉSULTAT TROUVÉ 🏆",
    "👾 PLAYER 1 MISSED - Tentez une autre recherche ! 👾",
    "👻 404 ERROR: PACMAN A MANGÉ TOUS LES RÉSULTATS 👻",
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * noResultMessages.length);
    return noResultMessages[randomIndex];
  };

  return (
    <div>
      <img className="games-logo" src={logoWG} alt="Logo" />
      <h1 className="games-title">NOS JEUX</h1>
      <div className="search-bar-container">
        <form
          id="games-search-bar"
          onSubmit={(event) => event.preventDefault()}
        >
          <img src={wen} alt="loupe" id="games-search-bar-img" />
          <input
            type="text"
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
            placeholder="Rechercher"
            id="game-search-input"
          />
          {valueInput && (
            <button
              type="button"
              onClick={() => setValueInput("")}
              className="games-search-bar-clear"
            >
              <CircleX size={28} />
            </button>
          )}
        </form>
      </div>
      <div className="search-result">
        <div className="games-container">
          {gamesFiltered.length === 0 ? (
            <div className="games-no-result">{getRandomMessage()}</div>
          ) : (
            gamesFiltered.map((game) => <GameCard key={game.id} game={game} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
