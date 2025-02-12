import "../styles/BlurredBackground.css";

interface BlurredBackgroundProps {
  children?: React.ReactNode;
}

const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ children }) => {
  return (
    <div className="background-container login">
      <div className="blur-circle circle-top" />
      <div className="blur-circle circle-right" />
      <div className="blur-circle circle-bottom" />
      <div className="content">{children}</div>
    </div>
  );
};

export default BlurredBackground;
