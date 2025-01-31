import path from "node:path";
import argon2 from "argon2";
import type { RequestHandler } from "express";
import type { UploadedFile } from "express-fileupload";
import jwt from "jsonwebtoken";
import cloudinary from "../../middleware/cloudinary";
import userRepository from "./userRepository";

type MyPayload = {
  sub: string;
  email: string;
  username: string;
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const browse: RequestHandler = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .reduce((acc: { [key: string]: string }, current) => {
        const [key, value] = current.split("=");
        acc[key] = value;
        return acc;
      }, {});

    const token = cookies?.authToken;

    if (!token) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as MyPayload;
    const user = await userRepository.readById(
      Number.parseInt(decoded.sub, 10),
    );

    if (!user) {
      res.status(401).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Token invalide" });
      return;
    }
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "l'ID de l'utilisateur est requis" });
      return;
    }

    const user = await userRepository.readById(Number(id));

    if (!user) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { name, firstname, email, username, password, phone_number } =
      req.body;

    if (
      !name?.trim() ||
      !firstname?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password
    ) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Le format d'email n'est pas valide" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
      return;
    }

    const existingEmail = await userRepository.readByEmail(email);
    if (existingEmail) {
      res.status(400).json({ error: "Cet adresse email est déjà utilisé" });
      return;
    }

    const existingUsername = await userRepository.readByUsername(username);
    if (existingUsername) {
      res.status(400).json({ error: "Ce pseudo n'est pas disponible" });
      return;
    }
    const hashedPassword = await argon2.hash(password, hashingOptions);

    let profilePicUrl = null;
    if (req.files && "profile_pic" in req.files) {
      const profilePic = req.files.profile_pic as UploadedFile;

      if (
        !["image/jpeg", "image/jpg", "image/png"].includes(profilePic.mimetype)
      ) {
        res.status(400).json({
          error:
            "Seuls les fichiers aux formats JPG, JPEG et PNG sont acceptés",
        });
        return;
      }

      try {
        const result = await cloudinary.uploader.upload(
          profilePic.tempFilePath,
          {
            folder: "profile_pics",
            resource_type: "auto",
          },
        );
        profilePicUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Erreur upload Cloudinary:", uploadError);
        res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
        return;
      }
    }

    const userId = await userRepository.create({
      name: name.trim(),
      firstname: firstname.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      password_hash: hashedPassword,
      phone_number: phone_number?.trim(),
      profile_pic: profilePicUrl,
      is_banned: false,
      is_admin: false,
    });

    res.status(201).json({
      message: "Bienvenue ! Votre compte a été créé avec succès",
      userId,
    });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedUpdates = [
      "name",
      "firstname",
      "email",
      "username",
      "phone_number",
      "profile_pic",
    ];

    if (req.files && "profile_pic" in req.files) {
      const profilePic = req.files.profile_pic as UploadedFile;
      const result = await cloudinary.uploader.upload(profilePic.tempFilePath, {
        folder: "profile_pics",
      });
      updates.profile_pic = result.secure_url;
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedUpdates.includes(key)),
    );

    const success = await userRepository.update(Number(id), filteredUpdates);

    if (!success) {
      res.status(404).json({ error: "L'Utilisateur non trouvé" });
      return;
    }

    const updatedUser = await userRepository.readById(Number(id));
    if (!updatedUser) {
      res.status(404).json({ error: "l'Utilisateur non trouvé" });
      return;
    }
    const { password_hash, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    res.status(501).json({ error: "Delete operation not implemented" });
  } catch (err) {
    next(err);
  }
};

const toggleBan: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { is_banned } = req.body;
    const affectedRows = await userRepository.toggleBan(userId, is_banned);

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
    const affectedRows = await userRepository.toggleAdmin(userId, is_admin);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy, toggleBan, toggleAdmin };
