import logoWG from "../assets/images/logo_wildy_gamy.png";
import "../styles/Play.css";
import SnakeGame from "../components/SnakeGame";

export default function Play() {
  return (
    <>
      <div className="play-page-container">
        <img className="play-wg-logo" src={logoWG} alt="Logo" />
        <h1 className="play-page-title">À TOI DE JOUER !</h1>
        <SnakeGame />
      </div>
    </>
  );
}
