import type { Request, RequestHandler, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import cloudinary from "../../middleware/cloudinary";
import type { CreatePrize } from "./prizeRepository";
import prizeRepository from "./prizeRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const prizes = await prizeRepository.readAll();

    res.json(prizes);
  } catch (err) {
    next(err);
  }
};

const browseAvailable: RequestHandler = async (req, res, next) => {
  try {
    const prizes = await prizeRepository.readAllAvailable();

    res.json(prizes);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const prizesId = Number(req.params.id);
    const prizes = await prizeRepository.read(prizesId);

    if (prizes == null) {
      res.sendStatus(404);
    } else {
      res.json(prizes);
    }
  } catch (err) {
    next(err);
  }
};

const updateAvailability: RequestHandler = async (req, res, next) => {
  try {
    const prizesId = Number(req.params.id);
    const isAvailable = req.body.isAvailable;

    await prizeRepository.updateAvailability(prizesId, isAvailable);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const prizeId = Number(req.params.id);
    const { name, description, exchange_price } = req.body;
    let imageUrl = req.body.image;

    if (req.files && "image" in req.files) {
      const image = req.files.image as UploadedFile;

      try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "prizes",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res.status(500).json({ error: "Error uploading image" });
        return;
      }
    }

    const prizeData = {
      id: prizeId,
      name,
      description,
      image: imageUrl,
      exchange_price: Number(exchange_price),
      is_available: true,
      ...(imageUrl && { image: imageUrl }),
    };

    const affectedRows = await prizeRepository.update(prizeData);

    if (affectedRows === 0) {
      res.status(404).json({ error: "Prize not found" });
    } else {
      const updatedPrize = await prizeRepository.read(prizeId);
      res.status(200).json(updatedPrize);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const prizeId = Number(req.params.id);
    await prizeRepository.delete(prizeId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, exchange_price, image, is_available } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !exchange_price?.toString().trim()
    ) {
      res.status(400).json({ error: "Les champs requis sont manquants" });
      return;
    }

    let imageUrl = null;
    if (req.files && "image" in req.files) {
      const image = req.files.image as UploadedFile;

      if (!["image/jpeg", "image/png", "image/gif"].includes(image.mimetype)) {
        res.status(400).json({ error: "Format d'image invalide" });
        return;
      }
      try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "prizes",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
        return;
      }
    }
    const prizeData = {
      name: name.trim(),
      description: description.trim(),
      image: imageUrl,
      exchange_price: Number(exchange_price),
      is_available: true,
    };

    const newPrizeId = await prizeRepository.create(prizeData as CreatePrize);
    const newPrize = await prizeRepository.read(newPrizeId);

    res.status(201).json(newPrize);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  browseAvailable,
  read,
  updateAvailability,
  edit,
  destroy,
  add,
};
