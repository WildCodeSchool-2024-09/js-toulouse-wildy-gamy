import { useEffect, useState } from "react";
import PrizeCard from "../components/PrizeCard";
import type { Prize } from "../services/types";
import "../styles/prizePage.css";
import logoWG from "../assets/images/logo_wildy_gamy.png";
import UserStatHeader from "../components/UserStatHeader";
import { useAuth } from "../services/authContext";
import type { User } from "../services/types";

const PrizePage = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [acquiredPrizes, setAcquiredPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${auth?.user.id}`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error,
        );
        setCurrentUser(null);
      }
    };

    checkAuthStatus();
  }, [auth]);

  useEffect(() => {
    const fetchAcquiredPrizes = async () => {
      if (!auth?.user?.id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${auth.user.id}/acquired`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setAcquiredPrizes(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des prix acquis:", error);
      }
    };

    fetchAcquiredPrizes();
  }, [auth?.user?.id]);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/prizes/available`,
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
        setPrizes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des prix:", error);
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
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
        setUsers(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error,
        );
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleExchange = async (prize: Prize) => {
    if (!currentUser) return;

    // Check if already acquired
    if (acquiredPrizes.some((acquiredPrize) => acquiredPrize.id === prize.id)) {
      alert("Vous possédez déjà ce prix.");
      return;
    }

    if (currentUser.current_points < prize.exchange_price) {
      alert("Vous n'avez pas assez de points pour cet échange.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${auth?.user.id}/points`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            points: prize.exchange_price,
            type: "subtract",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Échec de l'échange de points");
      }

      const acquiredResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${auth?.user.id}/acquired`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ prize_id: prize.id }),
        },
      );

      if (!acquiredResponse.ok) {
        throw new Error("Échec de l'ajout du prix acquis");
      }

      // Update states immediately after successful exchange
      const newPoints = currentUser.current_points - prize.exchange_price;
      setCurrentUser({ ...currentUser, current_points: newPoints });
      setAcquiredPrizes([...acquiredPrizes, prize]);
    } catch (error) {
      console.error("Erreur lors de l'échange:", error);
      alert("Une erreur est survenue lors de l'échange.");
    }
  };

  if (loading) {
    return (
      <div className="prizes-page">
        <div className="prizes-page__loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prizes-page">
        <div className="prizes-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="prize-page">
      <img className="prize-logo" src={logoWG} alt="Logo" />
      <h1 className="prizes-page__title">RÉCOMPENSES</h1>
      <div className="prizes-page__ranking">
        {auth && (
          <div className="ranking-header">
            <UserStatHeader ranking={users} user={currentUser} />
          </div>
        )}
      </div>
      <div className="prizes-page__grid">
        {prizes.map((prize) => {
          if (!auth) {
            return (
              <PrizeCard
                key={prize.id}
                prize={prize}
                onExchange={() => {}}
                isAcquired={false}
                requiresAuth={true}
              />
            );
          }

          const isAcquired = acquiredPrizes.some(
            (acquiredPrize) => acquiredPrize.id === prize.id,
          );
          const canAfford = currentUser
            ? currentUser.current_points >= prize.exchange_price
            : false;

          return (
            <PrizeCard
              key={prize.id}
              prize={prize}
              onExchange={() => handleExchange(prize)}
              isAcquired={isAcquired}
              canAfford={canAfford}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PrizePage;
