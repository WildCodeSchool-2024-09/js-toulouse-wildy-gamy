import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";
import type { Game } from "../games/gamesRepository";

class FavoritesRepository {
  async read(userId: number) {
    const [rows] = await databaseClient.query(
      `SELECT g.* FROM game g
       INNER JOIN favorite f ON f.game_id = g.id
       WHERE f.user_id = ?`,
      [userId],
    );

    return rows as Game[];
  }

  async create(userId: number, gameId: number) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO favorite (user_id, game_id) VALUES (?, ?)",
      [userId, gameId],
    );
    return result.insertId;
  }

  async delete(userId: number, gameId: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM favorite WHERE user_id = ? AND game_id = ?",
      [userId, gameId],
    );
    return result.affectedRows;
  }
}

export default new FavoritesRepository();
