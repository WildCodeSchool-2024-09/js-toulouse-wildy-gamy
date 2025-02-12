import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  name: string;
  firstname: string;
  email: string;
  username: string;
  password_hash: string;
  phone_number?: string | null;
  profile_pic?: string | null;
  total_points: number;
  current_points: number;
  highscore: number;
  is_banned: number;
  is_admin: number;
  password?: string;
  points_credited_today?: boolean;
};

type CreateUserInput = Omit<
  User,
  "id" | "password_hash" | "total_points" | "current_points"
> & {
  password_hash: string;
};

class UserRepository {
  async create(user: CreateUserInput) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO user (
        name, firstname, email, username, 
        password_hash, phone_number, profile_pic,
        total_points, current_points, highscore, is_banned, is_admin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0)`,
      [
        user.name,
        user.firstname,
        user.email,
        user.username,
        user.password_hash,
        user.phone_number || null,
        user.profile_pic || null,
      ],
    );

    return result.insertId;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user ORDER BY total_points DESC",
    );
    return rows as User[];
  }

  async readById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );
    return rows[0] as User | undefined;
  }

  async readByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );
    return rows[0] as User | undefined;
  }

  async readByEmailWithPassword(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name, firstname, email, username, password_hash, phone_number, profile_pic, total_points, current_points, highscore, is_banned, is_admin FROM user WHERE email = ?",
      [email],
    );
    return rows[0] as User | undefined;
  }

  async readByUsername(username: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE username = ?",
      [username],
    );
    return rows[0] as User | undefined;
  }

  async update(id: number, updates: Partial<User>) {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(updates), id];

    const [result] = await databaseClient.query<Result>(
      `UPDATE user SET ${setClause} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  }

  async updateHighscore(id: number, highscore: number) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET highscore = ? WHERE id = ?",
      [highscore, id],
    );
    return result.affectedRows > 0;
  }

  async updatePoints(id: number, currentPoints: number, totalPoints: number) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET current_points = ?, total_points = ? WHERE id = ?",
      [currentPoints, totalPoints, id],
    );
    return result.affectedRows > 0;
  }

  async updatePointsCreditedToday(id: number, pointsCreditedToday: boolean) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET points_credited_today = ? WHERE id = ?",
      [pointsCreditedToday, id],
    );
    return result.affectedRows > 0;
  }

  async resetPointsCreditedToday() {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET points_credited_today = FALSE",
    );
    return result.affectedRows > 0;
  }

  async toggleBan(id: number, isBanned: boolean) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET is_banned = ? WHERE id = ?",
      [isBanned ? 1 : 0, id],
    );
    return result.affectedRows;
  }

  async toggleAdmin(id: number, isAdmin: boolean) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET is_admin = ? WHERE id = ?",
      [isAdmin ? 1 : 0, id],
    );
    return result.affectedRows;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM user WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new UserRepository();
