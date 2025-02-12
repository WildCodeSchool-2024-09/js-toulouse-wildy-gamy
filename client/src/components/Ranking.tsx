import { Crown } from "lucide-react";
import defaultProfilePic from "../assets/images/logo_wildy_gamy.png";
import type { User } from "../services/types";

interface RankingProps {
  user: User;
  position: number;
  isCurrentUser?: boolean;
}

const Ranking = ({ user, position, isCurrentUser }: RankingProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="ranking-list">
      <div className="ranking-item-container">
        <div
          className={`ranking-number ${isCurrentUser ? "ranking-text-neon" : ""}`}
        >
          {position}
        </div>
        <div
          className={`ranking-item ${isCurrentUser ? "ranking-item-neon" : ""}`}
        >
          <img
            src={user.profile_pic || defaultProfilePic}
            alt={user.username || "Utilisateur"}
            className="ranking-profilepic"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultProfilePic;
            }}
          />
          <div className="ranking-users">
            <p className="ranking-usersname">{user.username || "Anonyme"}</p>
            <div className="ranking-userspoints">
              <p className="ranking-totalpoints">
                <Crown className="ranking-imagescore" />
                {user.total_points || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
