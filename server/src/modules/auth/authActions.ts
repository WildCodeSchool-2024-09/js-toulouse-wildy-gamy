import argon2 from "argon2";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import userRepository from "../user/userRepository";

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      res.status(422).json({ error: "Email et mot de passe requis" });
      return;
    }
    const user = await userRepository.readByEmailWithPassword(
      email.trim().toLowerCase(),
    );

    if (!user) {
      res.status(422).json({ error: "Identifiants invalides" });
      return;
    }
    const verified = await argon2.verify(user.password_hash, password);

    if (!verified) {
      res.status(422).json({ error: "Identifiants invalides" });
      return;
    }

    if (user.is_banned === 1) {
      res.status(403).json({ error: "Compte suspendu" });
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        sub: user.id.toString(),
        email: user.email,
        isAdmin: user.is_admin === 1,
      },
      process.env.APP_SECRET as string,
      { expiresIn: "24h" },
    );

    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax`,
    );
    res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Erreur dans le processus de login:", err);
    res
      .status(500)
      .json({ error: "Une erreur est survenue lors de la connexion" });
  }
};

const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }

    const decoded = jwt.verify(token, process.env.APP_SECRET as string) as {
      sub: string;
      email: string;
      isAdmin: boolean;
    };

    const user = await userRepository.readById(Number(decoded.sub));

    if (!user || user.is_banned === 1) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }

    req.auth = decoded;
    next();
  } catch (err) {
    res.setHeader("Set-Cookie", "auth_token=; HttpOnly; Path=/; Max-Age=0");
    res.status(401).json({ error: "Non autorisé" });
  }
};

export default { login, verifyToken };
