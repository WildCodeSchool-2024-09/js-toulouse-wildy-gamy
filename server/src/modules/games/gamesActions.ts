import type { Request, RequestHandler, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import cloudinary from "../../middleware/cloudinary";
import type { CreateGame } from "./gamesRepository";
import gamesRepository from "./gamesRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const games = await gamesRepository.readAll();

    res.json(games);
  } catch (err) {
    next(err);
  }
};

const browseAvailable: RequestHandler = async (req, res, next) => {
  try {
    const games = await gamesRepository.readAllAvailable();

    res.json(games);
  } catch (err) {
    next(err);
  }
};

const browseNew: RequestHandler = async (req, res, next) => {
  try {
    const games = await gamesRepository.readallNew();

    res.json(games);
  } catch (err) {
    next(err);
  }
};

const toggleNew: RequestHandler = async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);
    const { isNew } = req.body;
    const affectedRows = await gamesRepository.toggleNew(gameId, isNew);
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const gamesId = Number(req.params.id);
    const games = await gamesRepository.read(gamesId);

    if (games == null) {
      res.sendStatus(404);
    } else {
      res.json(games);
    }
  } catch (err) {
    next(err);
  }
};

const updateAvailability: RequestHandler = async (req, res, next) => {
  try {
    const gamesId = Number(req.params.id);
    const isAvailable = req.body.isAvailable;

    await gamesRepository.updateAvailability(gamesId, isAvailable);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const gamesId = Number(req.params.id);
    const { name, description, price, is_available, is_new } = req.body;
    let imageUrl = req.body.image;

    if (req.files && "image" in req.files) {
      const image = req.files.image as UploadedFile;

      try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "games",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("cloudinary upload error:", uploadError);
        res.status(500).json({ error: "Error uploading image" });
        return;
      }
    }

    const gameData = {
      id: gamesId,
      name,
      description,
      image: imageUrl,
      price: Number(price),
      is_available: true,
      ...(imageUrl && { image: imageUrl }),
    };

    const affectedRows = await gamesRepository.update(gameData);
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      const updatedGame = await gamesRepository.read(gamesId);
      res.status(200).json(updatedGame);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const gamesId = Number(req.params.id);
    await gamesRepository.delete(gamesId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, price, is_available } = req.body;

    let imageUrl = null;
    if (req.files && "image" in req.files) {
      const image = req.files.image as UploadedFile;

      try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "games",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        res.status(500).json({ error: "Error uploading image" });
        return;
      }
    }

    const gameData = {
      name: name?.trim(),
      description: description?.trim(),
      image: imageUrl,
      price: Number(price),
      is_available: true,
      is_new: false,
    };

    const newGameId = await gamesRepository.create(gameData as CreateGame);

    const newGame = await gamesRepository.read(newGameId);

    res.status(201).json(newGame);
  } catch (err) {
    console.error("Erreur complète dans add:", err);
    next(err);
  }
};

export default {
  browse,
  browseAvailable,
  browseNew,
  read,
  updateAvailability,
  edit,
  destroy,
  add,
  toggleNew,
};
