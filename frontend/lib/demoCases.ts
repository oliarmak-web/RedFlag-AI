import { DemoCase } from "./types";

export const demoCases: DemoCase[] = [
  {
    id: "phishing-email",
    label: "Phishing Email",
    category: "Email",
    value:
      "Subject: Urgent account verification needed\n\nYour payroll access will be suspended in 2 hours unless you re-verify your login at http://secure-payroll-check.info.",
  },
  {
    id: "suspicious-qr",
    label: "Suspicious QR Code",
    category: "QR",
    value:
      "A printed flyer says: 'Scan this QR now to claim your free tax refund'. The QR sticker looks pasted over another code and leads to a site asking for SSN and debit card details.",
  },
  {
    id: "fake-recruiter",
    label: "Fake Recruiter",
    category: "Recruiting",
    value:
      "Hi, I am from Google hiring team. We need your SSN and bank info immediately to process onboarding for a remote role. Offer expires today.",
  },
  {
    id: "fake-profile",
    label: "Fake Social Profile",
    category: "Social",
    value:
      "Profile claims to be a verified celebrity investor, has a new account, very few real interactions, and keeps pushing followers to DM for guaranteed crypto returns.",
  },
  {
    id: "voice-clone",
    label: "Voice-Cloning Transcript",
    category: "Voice",
    value:
      "Mom it's me. I had an accident and my phone died. Please do not call anyone. I need you to wire $3000 right now to this account before police process me.",
  },
];
