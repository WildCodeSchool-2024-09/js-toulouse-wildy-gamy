import argon2 from "argon2";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, stayConnected } = req.body;

    if (!email?.trim() || !password) {
      res.status(400).json({ error: "Email et mot de passe requis" });
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

    const { password_hash, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        sub: user.id.toString(),
        email: user.email,
        username: user.username,
      },
      process.env.APP_SECRET as string,
      {
        expiresIn: stayConnected ? "30d" : "24h",
      },
    );

    const maxAge = stayConnected
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;
    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    );

    res.json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

const verifyToken: RequestHandler = (req, res, next) => {
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
      throw new Error("Token non trouvé");
    }

    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as MyPayload;

    req.auth = decoded;
    next();
  } catch (err) {
    res.setHeader(
      "Set-Cookie",
      `authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    );
    res.status(401).json({ error: "Non autorisé" });
  }
};

export default { login, verifyToken };
