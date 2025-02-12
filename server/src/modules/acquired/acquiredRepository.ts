import type { ResultSetHeader } from "mysql2";
import databaseClient from "../../../database/client";

class AcquiredRepository {
  async read(userId: number) {
    const [rows] = await databaseClient.query(
      `SELECT p.* FROM prize p
       INNER JOIN prize_acquired pa ON pa.prize_id = p.id
       WHERE pa.user_id = ?`,
      [userId],
    );
    return rows;
  }

  async add(userId: number, prizeId: number) {
    const [result] = await databaseClient.query<ResultSetHeader>(
      "INSERT INTO prize_acquired (user_id, prize_id) VALUES (?, ?)",
      [userId, prizeId],
    );
    return result.affectedRows > 0;
  }
}

export default new AcquiredRepository();
