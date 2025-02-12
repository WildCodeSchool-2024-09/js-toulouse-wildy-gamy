import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  BookText,
  Scissors,
  Shield,
  Star,
  TriangleAlert,
} from "lucide-react";
import "../styles/SnakeGame.css";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../services/authContext";
import AlertModalAdmin from "./AlertModal";
import GameLoginModal from "./GameLoginModal";

type Position = {
  x: number;
  y: number;
};

type PowerUpType = "hungry" | "shrink" | "invincible";

interface PowerUp extends Position {
  type: PowerUpType;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Position = { x: 1, y: 0 };

const DIFFICULTY_LEVELS = {
  medium: { label: "Medium", speed: 150, obstacles: 10 },
} as const;

const POWER_UPS = {
  hungry: {
    icon: <Star className="power-up-icons" size={16} />,
    color: "powerup-hungry",
    duration: 10000,
  },
  shrink: {
    icon: <Scissors className="power-up-icons" size={16} />,
    color: "powerup-shrink",
    duration: 1,
  },
  invincible: {
    icon: <Shield className="power-up-icons" size={16} />,
    color: "powerup-invincible",
    duration: 10000,
  },
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty] = useState<keyof typeof DIFFICULTY_LEVELS>("medium");
  const [powerUp, setPowerUp] = useState<PowerUp | null>(null);
  const [activePowerUp, setActivePowerUp] = useState<PowerUpType | null>(null);
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [obstacleCoordinates, setObstacleCoordinates] = useState<Position[]>(
    [],
  );
  const { auth } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [lastClickDate, setLastClickDate] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const handleStartGame = () => {
    if (!auth) {
      setIsLoginModalOpen(true);
    } else {
      restartGame();
    }
  };

  const generateRandomPosition = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const arePositionsEqual = useCallback(
    (pos1: Position, pos2: Position): boolean =>
      pos1.x === pos2.x && pos1.y === pos2.y,
    [],
  );

  useEffect(() => {
    const fetchHighScore = async () => {
      if (!auth?.user?.id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${auth.user.id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch highscore");

        const data = await response.json();
        setHighScore(data.highscore || 0);
      } catch (err) {
        console.error("Error fetching highscore:", err);
      }
    };

    fetchHighScore();
  }, [auth]);

  const updateHighScore = useCallback(async () => {
    if (!auth?.user?.id || score <= highScore) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${auth.user.id}/highscore`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ highscore: score }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update highscore");
      }

      setHighScore(score);
    } catch (err) {
      console.error("Error updating highscore:", err);
    }
  }, [auth, score, highScore]);

  useEffect(() => {
    const preventArrowKeyScroll = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventArrowKeyScroll);

    return () => {
      window.removeEventListener("keydown", preventArrowKeyScroll);
    };
  }, []);

  useEffect(() => {
    if (gameOver && score > highScore) {
      updateHighScore();
    }
  }, [gameOver, score, highScore, updateHighScore]);

  const calculateCredit = (score: number): number => {
    const result = score / 10;
    const decimalPart = result - Math.floor(result);

    if (decimalPart >= 0.5) {
      return Math.ceil(result);
    }
    return Math.floor(result);
  };

  const credit = calculateCredit(score);

  const updatePoints = async (type: "add" | "subtract") => {
    if (!auth?.user?.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${auth.user.id}/points`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ points: credit, type }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update points");
      }
      setLastClickDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Error updating points:", err);
    }
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!auth?.user?.id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${auth.user.id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch user status");

        const data = await response.json();
        setLastClickDate(
          data.points_credited_today
            ? new Date().toISOString().split("T")[0]
            : null,
        );
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
    };

    fetchUserStatus();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - new Date().getTime();

    const timer = setTimeout(async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/reset-points-credited-today`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setLastClickDate(null);
      } catch (err) {
        console.error("Error resetting points credited today:", err);
      }
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [auth]);

  const handleAddScoreClick = () => {
    setModalConfig({
      title: "Créditer les points",
      message:
        "Cette action n'est possible qu'une fois par jour. Voulez-vous continuer?",
      onConfirm: () => {
        updatePoints("add");
        setLastClickDate(new Date().toISOString().split("T")[0]);
        setModalConfig(null);
      },
    });
  };

  const restartGame = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setSnake(INITIAL_SNAKE);
          setFood(generateFood());
          setDirection(INITIAL_DIRECTION);
          setGameOver(false);
          setScore(0);
          setGameStarted(true);
          setPowerUp(null);
          setActivePowerUp(null);
          setObstacles(generateObstacles());
          setIsPaused(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateFood = useCallback((): Position => {
    let position: Position;
    do {
      position = generateRandomPosition();
    } while (
      snake.some((segment) => arePositionsEqual(segment, position)) ||
      obstacleCoordinates.some((obstacle) =>
        arePositionsEqual(obstacle, position),
      )
    );
    return position;
  }, [snake, obstacleCoordinates, arePositionsEqual, generateRandomPosition]);

  const generatePowerUp = useCallback(() => {
    if (Math.random() < 0.1) {
      const types = Object.keys(POWER_UPS) as PowerUpType[];
      const type = types[Math.floor(Math.random() * types.length)];
      let position: Position;
      do {
        position = generateRandomPosition();
      } while (
        snake.some((segment) => arePositionsEqual(segment, position)) ||
        arePositionsEqual(food, position) ||
        obstacles.some((obstacle) => arePositionsEqual(obstacle, position))
      );
      return { ...position, type };
    }
    return null;
  }, [snake, food, obstacles, arePositionsEqual, generateRandomPosition]);

  const generateObstacles = useCallback(() => {
    const newObstacles: Position[] = [];
    const obstacleCount = DIFFICULTY_LEVELS[difficulty].obstacles;
    const middleY = Math.floor(GRID_SIZE / 2);

    for (let i = 0; i < obstacleCount; i++) {
      let obstacle: Position;
      do {
        const randomPosition = generateRandomPosition();
        obstacle = {
          x: randomPosition.x,
          y:
            randomPosition.y === middleY
              ? Math.random() < 0.5
                ? middleY - 1
                : middleY + 1
              : randomPosition.y,
        };
      } while (
        snake.some((segment) => arePositionsEqual(segment, obstacle)) ||
        arePositionsEqual(food, obstacle) ||
        newObstacles.some((existingObstacle) =>
          arePositionsEqual(existingObstacle, obstacle),
        )
      );
      newObstacles.push(obstacle);
    }
    setObstacleCoordinates(newObstacles);
    return newObstacles;
  }, [difficulty, snake, food, arePositionsEqual, generateRandomPosition]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = setInterval(
      () => {
        setSnake((prevSnake) => {
          const newHead = {
            x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
            y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
          };

          if (
            (prevSnake.some((segment) => arePositionsEqual(segment, newHead)) ||
              obstacles.some((obstacle) =>
                arePositionsEqual(obstacle, newHead),
              )) &&
            activePowerUp !== "invincible"
          ) {
            setGameOver(true);
            clearInterval(gameLoop);
            return prevSnake;
          }

          let newSnake = [newHead, ...prevSnake];

          if (arePositionsEqual(newHead, food)) {
            setFood(generateFood());
            setScore(
              (prevScore) => prevScore + (activePowerUp === "hungry" ? 2 : 1),
            );
            setPowerUp(generatePowerUp());
          } else {
            newSnake.pop();
          }

          if (powerUp && arePositionsEqual(newHead, powerUp)) {
            setActivePowerUp(powerUp.type);
            setPowerUp(null);
            setTimeout(
              () => setActivePowerUp(null),
              POWER_UPS[powerUp.type].duration,
            );

            if (powerUp.type === "shrink") {
              newSnake = newSnake.slice(
                0,
                Math.max(1, Math.floor(newSnake.length / 2)),
              );
            }
          }

          return newSnake;
        });
      },
      activePowerUp === "hungry"
        ? DIFFICULTY_LEVELS[difficulty].speed
        : DIFFICULTY_LEVELS[difficulty].speed,
    );

    return () => clearInterval(gameLoop);
  }, [
    direction,
    food,
    generateFood,
    gameStarted,
    difficulty,
    powerUp,
    activePowerUp,
    obstacles,
    gameOver,
    isPaused,
    arePositionsEqual,
    generatePowerUp,
  ]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
        case " ":
          setIsPaused((prevPaused) => !prevPaused);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setPowerUp(null);
    setActivePowerUp(null);
    setObstacles([]);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused((prevPaused) => !prevPaused);
  };

  const renderBoard = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some((segment) =>
          arePositionsEqual(segment, { x, y }),
        );
        const isFood = arePositionsEqual(food, { x, y });
        const isPowerUp = powerUp && arePositionsEqual(powerUp, { x, y });
        const isObstacle = obstacles.some((obstacle) =>
          arePositionsEqual(obstacle, { x, y }),
        );

        let cellClass = "cell";
        if (isSnake) {
          if (activePowerUp === "invincible") {
            cellClass += " snake-invincible";
          } else if (activePowerUp === "hungry") {
            cellClass += " snake-hungry";
          } else {
            cellClass += " snake";
          }
        } else if (isFood) {
          cellClass += " food";
        } else if (isPowerUp && powerUp) {
          cellClass += ` power-up ${POWER_UPS[powerUp.type].color}`;
        } else if (isObstacle) {
          cellClass += " obstacle";
        }

        cells.push(
          <div key={`${x},${y}`} className={cellClass}>
            {isPowerUp && powerUp && (
              <div className="cell-content">{POWER_UPS[powerUp.type].icon}</div>
            )}
          </div>,
        );
      }
    }
    return cells;
  };

  return (
    <div className="game-container">
      <div className="game-header-container">
        <button
          type="button"
          className="rules-button"
          onClick={() => setShowRules(true)}
        >
          Règles <BookText size={16} />
        </button>
        <div className="score-container">
          <div className="high-score">Record: {highScore}</div>
          <div className="score">Score: {score}</div>
        </div>
      </div>
      <div className="game-board">{renderBoard()}</div>

      {showRules && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              type="button"
              className="modal-close-button"
              onClick={() => setShowRules(false)}
            >
              ✕
            </button>
            <h2>Règles du jeu</h2>
            <ul>
              <li>
                Utilisez les flèches directionnelles pour déplacer le serpent
              </li>
              <li>Mangez les pommes pour grandir</li>
              <li>Évitez les obstacles et ne vous mordez pas la queue</li>
              <li>Collectez les power-ups pour des bonus spéciaux:</li>
              <ul>
                <li className="modal-text-hungry">
                  <Star className="star-icons-modal" size={16} /> Double les
                  points obtenus (10s)
                </li>
                <li className="modal-text-shrink">
                  <Scissors className="scissors-icons-modal" size={16} /> Réduit
                  la taille du serpent
                </li>
                <li className="modal-text-invincible">
                  <Shield className="shield-icons-modal" size={16} />{" "}
                  Invincibilité temporaire (10s)
                </li>
              </ul>
              <li>
                <TriangleAlert className="triangle-icons-modal" size={16} />{" "}
                Manger une pomme fait disparaitre le bonus!
              </li>
            </ul>
          </div>
        </div>
      )}
      {countdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown">{countdown}</div>
        </div>
      )}

      {!gameStarted && (
        <div className="game-controls">
          <button
            type="button"
            className="button primary"
            onClick={handleStartGame}
          >
            Start Game
          </button>
          {isLoginModalOpen && (
            <GameLoginModal onClose={() => setIsLoginModalOpen(false)} />
          )}
        </div>
      )}

      {gameStarted && !gameOver && (
        <button
          type="button"
          className="button secondary"
          onClick={togglePause}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}

      <div className="direction-controls">
        <button
          type="button"
          className="button direction"
          onClick={() =>
            !gameOver && !isPaused && setDirection({ x: 0, y: -1 })
          }
          disabled={gameOver || isPaused}
        >
          <ArrowBigUp className="game-arrow-icons" size={32} />
        </button>
        <button
          type="button"
          className="button direction"
          onClick={() => !gameOver && !isPaused && setDirection({ x: 0, y: 1 })}
          disabled={gameOver || isPaused}
        >
          <ArrowBigDown className="game-arrow-icons" size={32} />
        </button>
        <button
          type="button"
          className="button direction"
          onClick={() =>
            !gameOver && !isPaused && setDirection({ x: -1, y: 0 })
          }
          disabled={gameOver || isPaused}
        >
          <ArrowBigLeft className="game-arrow-icons" size={32} />
        </button>
        <button
          type="button"
          className="button direction"
          onClick={() => !gameOver && !isPaused && setDirection({ x: 1, y: 0 })}
          disabled={gameOver || isPaused}
        >
          <ArrowBigRight className="game-arrow-icons" size={32} />
        </button>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>Game Over</h2>
            <p>Résultat: {score}</p>
            <p>Points: {credit}</p>
            <button
              type="button"
              className="button primary"
              onClick={handleAddScoreClick}
              disabled={
                lastClickDate === new Date().toISOString().split("T")[0]
              }
            >
              Créditer les points
            </button>
            <AlertModalAdmin
              title="Créditer les points"
              message="Cette action n'est possible qu'une fois par jour. Voulez-vous continuer?"
              visible={!!modalConfig}
              onConfirm={modalConfig?.onConfirm || (() => {})}
              onClose={() => setModalConfig(null)}
            />
            <p>Meilleur score: {highScore}</p>
            <button
              type="button"
              className="button primary"
              onClick={resetGame}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
