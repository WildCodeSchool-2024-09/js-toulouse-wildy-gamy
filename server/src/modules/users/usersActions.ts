import type { RequestHandler } from "express";
import usersRepository from "./usersRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await usersRepository.readAll();

    res.json(users);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await usersRepository.read(userId);

    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const user = {
      id: Number(req.params.id),
      name: req.body.name,
      firstname: req.body.firstname,
      email: req.body.email,
      username: req.body.username,
      phone_number: req.body.phone_number,
      profile_pic: req.body.profile_pic,
      total_points: req.body.total_points,
      current_points: req.body.current_points,
      is_banned: req.body.is_banned,
      is_admin: req.body.is_admin,
    };

    const affectedRows = await usersRepository.update(user);
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    await usersRepository.delete(userId);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const user = {
      name: req.body.name,
      firstname: req.body.firstname,
      email: req.body.email,
      username: req.body.username,
      phone_number: req.body.phone_number,
      profile_pic: req.body.profile_pic,
      total_points: req.body.total_points,
      current_points: req.body.current_points,
      is_banned: req.body.is_banned,
      is_admin: req.body.is_admin,
    };

    const insertId = await usersRepository.create(user);

    res.status(201).json({ id: insertId });
  } catch (err) {
    next(err);
  }
};

const toggleBan: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { is_banned } = req.body;
    const affectedRows = await usersRepository.toggleBan(userId, is_banned);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const toggleAdmin: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { is_admin } = req.body;
    const affectedRows = await usersRepository.toggleAdmin(userId, is_admin);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, edit, destroy, add, toggleBan, toggleAdmin };
