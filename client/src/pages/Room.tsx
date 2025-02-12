import "../styles/Room.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWG from "../assets/images/logo_wildy_gamy.png";
import arrowGameOnline from "../assets/images/room-arrow-gameonline.svg";
import roomImage from "../assets/images/room-image.jpg";
import imageOnline from "../assets/images/room-snake-image.png";
import roomArrow from "../assets/images/room_arrow.svg";
import InfoModal from "../components/InfoModal";
import type { Game } from "../services/types";

function RoomDescription() {
  return (
    <div className="room-container">
      <img src={roomImage} alt="room" className="room-image" />
      <div className="room-bigcontainer">
        <div className="room-text">
          <p className="room-title-history">
            <strong>Notre histoire</strong>
          </p>
          <p>
            Né de l'imagination de quatre passionnés Justine, Charlotte, Abdou
            et Florentin, Wildy Gamy redéfinit l'expérience arcade à Toulouse.
            Ce lieu unique mêle jeu en ligne et physique : gagnez des points
            depuis chez vous et échangez-les contre des sessions sur place.
            Entre jeux rétro, dernières nouveautés et espace lounge équipé, cet
            établissement est devenu le repaire incontournable des gamers
            toulousains.
          </p>
          <p className="room-adress">
            <strong>
              8 Rue de Valenciennes
              <br />
              31000 Toulouse
            </strong>
          </p>
          <p className="room-timetable">
            <strong>
              Mardi au Dimanche : 10:30 - 1:00
              <br />
              05 55 55 55 55
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function RoomCarousel() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/games/new`,
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des jeux");
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    games.length > 0 && (
      <div className="room-carousel">
        <div className="room-titlecontainercarousel">
          <h1 className="room-titlecarousel">NEW GAME</h1>
          <Link to="/games">
            <img src={roomArrow} alt="arrow" className="room-arrowimage" />
          </Link>
        </div>
        <div className="room-carouselcontainer">
          {games.map((game) => (
            <article key={game.id} className="room-gamecard">
              <div className="room-gameimagecontainer">
                <img
                  src={game.image}
                  alt={game.name}
                  className="room-gameimage"
                />
              </div>
              <h2 className="room-gametitle">{game.name}</h2>
            </article>
          ))}
        </div>
      </div>
    )
  );
}

function RoomGameOnline() {
  const navigation = useNavigate();
  return (
    <div
      onClick={() => {
        navigation("/play");
      }}
      onKeyDown={() => {
        navigation("/play");
      }}
      className="room-gameonline"
    >
      <img
        src={imageOnline}
        alt="image-online"
        className="room-image-gameonline"
      />
      <div className="room-gameonlinebigcontainer">
        <div className="room-gameonlinecontainer">
          <div className="room-gameonlinecontent">
            <h1 className="room-titlegameonline">
              Jeu en
              <br />
              Ligne
            </h1>
            <p className="room-textgameonline">
              <strong>
                Jouez
                <br />
                Gagnez des points
                <br />
                Restez dans le top 10
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="room-arrow-container">
        <img
          src={arrowGameOnline}
          alt="arrow game online"
          className="room-arrow-gameonline"
        />
      </div>
    </div>
  );
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function RoomForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onClick: () => void;
  } | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le Nom est requis";
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      newErrors.email = "L'email est requis et doit être valide";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Une erreur lors de l'envoi");

      setErrors({});
      setModalConfig({
        title: "Message envoyé",
        message: "Formulaire envoyé avec succès !",
        onClick: () => {
          setModalConfig(null);
        },
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setModalConfig({
        title: "Erreur",
        message: "Une erreur est survenue",
        onClick: () => {
          setModalConfig(null);
        },
      });
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Contactez-nous</h2>
      <form id="myForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Votre Nom
            <span className="contact-form-asterisk" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="ex : DUPONT"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">
            Adresse email
            <span className="contact-form-asterisk" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ex : lorem.ipsum@gmail.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="subject">
            Sujet
            <span className="contact-form-asterisk" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="ex : réservation"
          />
          {errors.subject && <span className="error">{errors.subject}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="message">
            Votre message
            <span className="contact-form-asterisk" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="ex : Bonjour"
          />
          {errors.message && <span className="error">{errors.message}</span>}
        </div>
        <button className="form-button" type="submit">
          <strong>Envoyer</strong>
        </button>
      </form>
      {modalConfig && (
        <InfoModal
          title={modalConfig.title}
          message={modalConfig.message}
          visible={true}
          onClose={modalConfig.onClick}
        />
      )}
    </div>
  );
}

function Room() {
  return (
    <div className="room-page">
      <img className="room-logo" src={logoWG} alt="Logo" />
      <h1 className="room-title">Wildy Gamy</h1>
      <div className="room-fullpage">
        <RoomDescription />
        <RoomCarousel />
        <RoomGameOnline />
        <RoomForm />
      </div>
    </div>
  );
}

export default Room;
