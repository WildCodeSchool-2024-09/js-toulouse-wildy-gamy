import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export type Game = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  is_available: boolean;
  is_new: boolean;
};

export type CreateGame = Omit<Game, "id">;

class gamesRepository {
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from game where id = ?",
      [id],
    );

    return rows[0] as Game;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from game ORDER BY name ASC",
    );

    return rows as Game[];
  }

  async readAllAvailable() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from game where is_available = 1 ORDER BY name ASC",
    );

    return rows as Game[];
  }

  async readallNew() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from game where is_new = 1 AND is_available = 1",
    );

    return rows as Game[];
  }

  async toggleNew(id: number, isNew: boolean) {
    const [result] = await databaseClient.query<Result>(
      "Update game set is_new = ? where id = ?",
      [isNew, id],
    );

    return result.affectedRows;
  }

  async updateAvailability(id: number, isAvailable: boolean) {
    await databaseClient.query<Result>(
      "update game set is_available = ? where id = ?",
      [isAvailable, id],
    );
  }

  async update(game: CreateGame & { id: number }) {
    const [result] = await databaseClient.query<Result>(
      "update game set name = ?, description = ?, price = ?, image = ?, is_available = ? where id = ?",
      [
        game.name,
        game.description,
        game.price,
        game.image,
        game.is_available,
        game.id,
      ],
    );

    return result.affectedRows;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from game where id = ?",
      [id],
    );

    return result.affectedRows;
  }

  async create(game: CreateGame) {
    const [result] = await databaseClient.query<Result>(
      "insert into game (name, description, price, image, is_available, is_new) values (?, ?, ?, ?, ?,?)",
      [
        game.name,
        game.description,
        game.price,
        game.image,
        game.is_available,
        game.is_new,
      ],
    );

    return result.insertId;
  }
}

export default new gamesRepository();
