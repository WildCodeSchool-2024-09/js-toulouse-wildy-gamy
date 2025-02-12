import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export type Prize = {
  id: number;
  name: string;
  description: string;
  image?: string | null;
  exchange_price: number;
  is_available: boolean;
};

export type CreatePrize = Omit<Prize, "id">;

class prizeRepository {
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from prize where id = ?",
      [id],
    );
    return rows[0] as Prize;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from prize ORDER BY exchange_price ASC",
    );
    return rows as Prize[];
  }

  async readAllAvailable() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from prize where is_available = 1 ORDER BY exchange_price ASC",
    );
    return rows as Prize[];
  }

  async updateAvailability(id: number, isAvailable: boolean) {
    await databaseClient.query<Result>(
      "update prize set is_available = ? where id = ?",
      [isAvailable, id],
    );
  }

  async update(prize: CreatePrize & { id: number }) {
    const [result] = await databaseClient.query<Result>(
      "update prize set name = ?, description = ?,  image = ?, exchange_price = ? where id = ?",
      [
        prize.name,
        prize.description,
        prize.image,
        prize.exchange_price,
        prize.id,
      ],
    );
    return result.affectedRows;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from prize where id = ?",
      [id],
    );
    return result.affectedRows;
  }

  async create(prize: CreatePrize) {
    const [result] = await databaseClient.query<Result>(
      "insert into prize (name, image, description, exchange_price, is_available) values (?, ?, ?, ?, ?)",
      [
        prize.name,
        prize.image,
        prize.description,
        prize.exchange_price,
        prize.is_available,
      ],
    );
    return result.insertId;
  }
}

export default new prizeRepository();
