import type { RequestHandler } from "express";
import acquiredRepository from "./acquiredRepository";

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const acquired = await acquiredRepository.read(userId);
    res.json(acquired);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { prize_id } = req.body;
    const success = await acquiredRepository.add(userId, prize_id);
    if (!success) {
      res.status(500).json({ error: "Failed to add acquired prize" });
      return;
    }
    res.status(201).json({ message: "Prize acquired successfully" });
  } catch (err) {
    next(err);
  }
};

export default { read, add };
