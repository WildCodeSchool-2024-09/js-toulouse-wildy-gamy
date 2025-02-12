import crypto from "node:crypto";
import argon2 from "argon2";
import type { RequestHandler } from "express";
import { transporter } from "../../modules/email/emailActions";
import userRepository from "../user/userRepository";

interface PasswordResetToken {
  email: string;
  token: string;
  expiresAt: Date;
}

const resetTokens = new Map<string, PasswordResetToken>();

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

export const requestPasswordReset: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userRepository.readByEmail(email);
    if (!user) {
      res
        .status(404)
        .json({ error: "Aucun compte associé à cette adresse email" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 600000);

    resetTokens.set(token, {
      email,
      token,
      expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/login?token=${token}`;

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Réinitialisation de votre mot de passe - Wildy Gamy",
      text: `
Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe.
Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :

${resetLink}

Ce lien expirera dans 10 minutes.

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

Cordialement,
L'équipe Wildy Gamy
      `,
      html: `
<h2>Réinitialisation de votre mot de passe</h2>
<p>Bonjour,</p>
<p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
<p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
<p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
<p><small>Ce lien expirera dans 10 minutes.</small></p>
<p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
<p>Cordialement,<br>L'équipe Wildy Gamy</p>
      `,
    });

    res.json({ message: "Instructions envoyées par email" });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'envoi de l'email de réinitialisation" });
  }
};

export const verifyResetToken: RequestHandler = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token manquant ou invalide" });
    return;
  }

  const resetToken = resetTokens.get(token);
  if (!resetToken || resetToken.expiresAt < new Date()) {
    res.status(400).json({ error: "Token invalide ou expiré" });
    return;
  }

  res.json({ valid: true });
  return;
};

export const resetPassword: RequestHandler = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ error: "Données manquantes" });
    return;
  }

  const resetToken = resetTokens.get(token);
  if (!resetToken || resetToken.expiresAt < new Date()) {
    res.status(400).json({ error: "Token invalide ou expiré" });
    return;
  }

  try {
    const user = await userRepository.readByEmail(resetToken.email);
    if (!user) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const hashedPassword = await argon2.hash(newPassword, hashingOptions);

    await userRepository.update(user.id, {
      password_hash: hashedPassword,
    });

    resetTokens.delete(token);
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error,
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du mot de passe" });
  }
};
