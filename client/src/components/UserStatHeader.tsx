import { Crown, Tickets, Trophy } from "lucide-react";
import defaultProfilePic from "../assets/images/logo_wildy_gamy.png";
import type { User } from "../services/types";

interface RankingUser {
  user: User | null;
  ranking: User[];
}

const calculateRanking = (users: User[], currentUser: User): number => {
  if (!Array.isArray(users) || !currentUser?.id) return 0;

  const sortedUsers = [...users].sort(
    (a, b) => b.total_points - a.total_points,
  );

  const userPosition =
    sortedUsers.findIndex((u) => u.id === currentUser.id) + 1;
  return userPosition;
};

const UserStatHeader = ({ user, ranking = [] }: RankingUser) => {
  if (!user || !user.username) return null;

  const userRanking = calculateRanking(ranking, user);

  return (
    <div className="ranking-profileheader">
      <img
        src={user.profile_pic || defaultProfilePic}
        alt={user.username || "Utilisateur"}
        className="ranking-userpic"
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultProfilePic;
        }}
      />
      <div className="ranking-userinfo">
        <div className="ranking-headertitle">
          <h2 className="ranking-username">Bonjour, {user.username} !</h2>
        </div>
        <div className="ranking-userstats">
          <div className="ranking-userpoints">
            <Crown className="ranking-image" />
            <p>{user.total_points || 0}</p>
          </div>
          <div className="ranking-userpoints">
            <Trophy className="ranking-image" />
            <p>{userRanking}</p>
          </div>
          <div className="ranking-userpoints">
            <Tickets className="ranking-image" />
            <p>{user.current_points || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatHeader;
