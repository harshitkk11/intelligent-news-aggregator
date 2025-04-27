import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const CLIENT_ID = process.env.AUTH_GOOGLE_ID!;
const CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET!;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const EMAIL_USER = process.env.EMAIL_USER!;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
  const { token } = await oauth2Client.getAccessToken();
  if (!token) {
    throw new Error("Failed to retrieve access token.");
  }

  const transportOptions: SMTPTransport.Options = {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: token,
    },
  };

  return nodemailer.createTransport(transportOptions);
}

export { createTransporter };
