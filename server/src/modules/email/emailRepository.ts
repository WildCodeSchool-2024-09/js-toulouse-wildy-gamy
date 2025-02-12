import { google } from "googleapis";
import nodemailer from "nodemailer";
import type { EmailData } from "./emailTypes";

export class EmailRepository {
  private oauth2CLient;
  private transporter: nodemailer.Transporter | undefined;

  constructor() {
    try {
      this.oauth2CLient = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        "http://localhost:3000",
      );

      this.oauth2CLient.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      });
    } catch (error) {
      console.error("Erreur d'initialisation de l'EmailRepository:", error);
    }
  }

  async initializeTransporter() {
    try {
      if (!this.oauth2CLient) {
        throw new Error("OAuth2 client is not initialized");
      }
      const accessToken = await this.oauth2CLient.getAccessToken();

      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GMAIL_EMAIL,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        },
      });
    } catch (error) {
      console.error("Erreur d'initialisation du transporter:", error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      if (!this.oauth2CLient) {
        throw new Error("OAuth2 client is not initialized");
      }

      const gmail = google.gmail({ version: "v1", auth: this.oauth2CLient });
      const response = await gmail.users.messages.list({
        userId: "me", // Utilisez "me" au lieu de l'email
        q: "in:inbox is:unread",
      });

      return response.data.messages?.length || 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      await this.initializeTransporter();

      const mailOptions = {
        from: `${emailData.name} <${emailData.email}>`,
        to: process.env.GMAIL_EMAIL,
        subject: emailData.subject,
        text: `
            New message from: ${emailData.name}
            Email: ${emailData.email}

            Message:
            ${emailData.message}`,
      };

      if (!this.transporter) {
        throw new Error("Transporter is not initialized");
      }
      const result = await this.transporter.sendMail(mailOptions);

      return result;
    } catch (error: unknown) {
      console.error("Erreur détaillée d'envoi d'email:", error);
      throw error;
    }
  }
}
