import dotenv from "dotenv";
import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { EmailRepository } from "./emailRepository"; // Adjust the path as necessary

dotenv.config(); // Charge les variables d'environnement depuis le fichier .env

// Création du transporteur SMTP
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.GMAIL_EMAIL, // Ton adresse Gmail
    pass: process.env.GMAIL_PASSWORD, // Le mot de passe d'application généré
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Fonction pour envoyer un email
interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export const sendContact = async (
  req: { body: ContactRequest },
  res: { status: (code: number) => { json: (body: ContactResponse) => void } },
) => {
  const { name, email, subject, message } = req.body;

  try {
    const info = await transporter.sendMail({
      from: email,
      to: "wildygamy.tlse@gmail.com",
      replyTo: email,
      subject: `Nouveau message de ${name} (${email}) : ${subject}`,
      text: `📩 Nouveau message reçu depuis le formulaire de contact :

👤 Nom : ${name}
✉️ Email : ${email}
📌 Sujet : ${subject}

💬 Message :
${message}

---
🚀 Cet email a été envoyé automatiquement depuis le site Wildy Gamy.
`,
    });

    res
      .status(200)
      .json({ success: true, message: "Email envoyé à l'équipe !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ success: false, message: "Erreur d'envoi" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const emailRepo = new EmailRepository();
    const count = await emailRepo.getUnreadCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Erreur lors de la récupération des emails non lus:", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};
