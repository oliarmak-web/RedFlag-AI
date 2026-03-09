import { DemoCase } from "./types";

export const demoCases: DemoCase[] = [
  {
    id: "bank-reset",
    label: "Bank Reset",
    category: "Banking",
    gravity: "Critical",
    value:
      "A text says: 'Bank of America fraud alert: your account has been locked. Reset your password immediately here: http://boa-security-reset.help to restore access.'",
  },
  {
    id: "government-impersonation",
    label: "Gov Impersonation",
    category: "Government",
    gravity: "Critical",
    value:
      "A caller says they are from the IRS and warns that legal action will start today unless the user immediately confirms their SSN and pays a balance through a provided payment portal.",
  },
  {
    id: "mfa-fatigue",
    label: "MFA Bombing",
    category: "Identity",
    gravity: "Critical",
    value:
      "A user keeps receiving unexpected two-factor approval prompts every few minutes, followed by a text saying 'Approve now to stop account lockout'.",
  },
  {
    id: "voice-clone",
    label: "Voice Clone",
    category: "Voice",
    gravity: "Critical",
    value:
      "Mom it's me. I had an accident and my phone died. Please do not call anyone. I need you to wire $3000 right now to this account before police process me.",
  },
  {
    id: "support-reset",
    label: "Support Scam",
    category: "Helpdesk",
    gravity: "Critical",
    value:
      "A caller claims to be from Microsoft security support, says your laptop is infected, and asks you to install remote access software immediately.",
  },
  {
    id: "fake-browser-update",
    label: "Fake Update",
    category: "Malware",
    gravity: "Critical",
    value:
      "A pop-up says your browser is out of date and requires an urgent update download. The file is named Chrome_Update_Security_Patch.zip from an unfamiliar site.",
  },
  {
    id: "oauth-consent",
    label: "OAuth Trap",
    category: "App Access",
    gravity: "Elevated",
    value:
      "A shared document asks the user to sign in with Google and grant a third-party app full inbox, drive, and contacts access before viewing the file.",
  },
  {
    id: "phishing-email",
    label: "Phishing Email",
    category: "Email",
    gravity: "Elevated",
    value:
      "Subject: Urgent account verification needed\n\nYour payroll access will be suspended in 2 hours unless you re-verify your login at http://secure-payroll-check.info.",
  },
  {
    id: "fake-recruiter",
    label: "Fake Recruiter",
    category: "Recruiting",
    gravity: "Elevated",
    value:
      "Hi, I am from Google hiring team. We need your SSN and bank info immediately to process onboarding for a remote role. Offer expires today.",
  },
  {
    id: "suspicious-qr",
    label: "Suspicious QR",
    category: "QR",
    gravity: "Watch",
    value:
      "A printed flyer says: 'Scan this QR now to claim your free tax refund'. The QR sticker looks pasted over another code and leads to a site asking for SSN and debit card details.",
  },
  {
    id: "fake-profile",
    label: "Fake Profile",
    category: "Social",
    gravity: "Watch",
    value:
      "Profile claims to be a verified celebrity investor, has a new account, very few real interactions, and keeps pushing followers to DM for guaranteed crypto returns.",
  },
];
