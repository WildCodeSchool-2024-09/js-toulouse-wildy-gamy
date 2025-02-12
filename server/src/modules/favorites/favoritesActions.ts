import type { RequestHandler } from "express";
import favoritesRepository from "./favoritesRepository";

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const favorites = await favoritesRepository.read(userId);
    res.json(favorites);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newFavorite = { userId: req.body.userId, gameId: req.body.gameId };
    const insertId = await favoritesRepository.create(
      newFavorite.userId,
      newFavorite.gameId,
    );
    res.sendStatus(201).json({ id: insertId });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const { userId, gameId } = req.body;
    await favoritesRepository.delete(userId, gameId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { read, add, destroy };
