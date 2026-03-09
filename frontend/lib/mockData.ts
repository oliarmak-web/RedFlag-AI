import { AnalysisResult, StoryResult } from "./types";

type MockDemo = {
  analysis: AnalysisResult;
  story: StoryResult;
};

export const mockDemos: Record<string, MockDemo> = {
  "phishing-email": {
    analysis: {
      risk_level: "High",
      summary: "Urgent language plus a lookalike domain makes this read like credential phishing.",
      signals_detected: ["Urgent deadline", "Non-official domain", "Account threat"],
      guidance: [
        "Do not click the link.",
        "Open the real payroll portal directly.",
        "Report the message if it targets work accounts.",
      ],
      confidence_note: "High confidence based on classic phishing patterns.",
    },
    story: {
      title: "Payroll Panic",
      short_story: "A fake warning tries to rush the user into a login page before they notice the URL is off by a few characters.",
      red_flags_spotted: ["Urgency", "Lookalike domain", "Threat framing"],
      lesson_learned: "Pause before logging in from warning messages.",
      visual_scene_description: "An email with a red warning banner, a countdown-style deadline, and a fake login button.",
      visual_cues: ["Warning tone", "Off-brand URL", "Immediate login demand"],
    },
  },
  "suspicious-qr": {
    analysis: {
      risk_level: "High",
      summary: "This QR setup looks tampered and funnels users toward identity and payment theft.",
      signals_detected: ["Layered QR sticker", "Reward bait", "Sensitive data request"],
      guidance: [
        "Do not scan the code.",
        "Type the official website manually instead.",
        "Avoid entering identity or payment details from public QR prompts.",
      ],
      confidence_note: "High confidence because QR tampering plus financial prompts is a strong attack pattern.",
    },
    story: {
      title: "Sticker Swap",
      short_story: "A public poster hides a malicious QR code behind a harmless-looking reward offer, steering users into a fake mobile form.",
      red_flags_spotted: ["Tampered sticker", "Prize bait", "SSN request"],
      lesson_learned: "Treat QR codes like untrusted links.",
      visual_scene_description: "A bright public poster with a slightly crooked replacement QR sticker layered over the original code.",
      visual_cues: ["Fresh sticker edges", "Big reward promise", "Form asking for SSN and card info"],
    },
  },
  "mfa-fatigue": {
    analysis: {
      risk_level: "High",
      summary: "This looks like MFA fatigue, where repeated approval prompts pressure the user into authorizing an attacker.",
      signals_detected: ["Unexpected push prompts", "Repeated login approvals", "Text pushing approval"],
      guidance: [
        "Do not approve the prompts.",
        "Change the account password immediately.",
        "Review active sessions and remove unknown devices.",
      ],
      confidence_note: "High confidence because the pattern matches repeated approval abuse.",
    },
    story: {
      title: "Approve to Stop It",
      short_story: "An attacker floods a user with login prompts until one finally gets approved out of confusion or exhaustion.",
      red_flags_spotted: ["Prompt spam", "Lockout fear message", "Unrequested login attempts"],
      lesson_learned: "Repeated prompts are not noise. They are a warning sign.",
      visual_scene_description: "A phone watch stack filled with back-to-back approval notifications and a text urging the user to tap yes.",
      visual_cues: ["Multiple MFA alerts", "Late-night approval spam", "Message saying approval will stop a lockout"],
    },
  },
  "oauth-consent": {
    analysis: {
      risk_level: "High",
      summary: "This is likely an OAuth consent phishing flow that tries to win trusted access instead of stealing a password directly.",
      signals_detected: ["Third-party app permission request", "Inbox and drive access", "Unexpected document gate"],
      guidance: [
        "Do not grant the app access.",
        "Open the file only through a verified sender or official shared drive.",
        "Review connected apps and remove anything unfamiliar.",
      ],
      confidence_note: "High confidence because broad permissions are being requested for a low-trust action.",
    },
    story: {
      title: "Grant Access to View",
      short_story: "Instead of asking for a password, the attacker uses a convincing consent screen to win lasting access to email and files.",
      red_flags_spotted: ["Overbroad app permissions", "Unexpected sign-in gate", "Sensitive scope access"],
      lesson_learned: "Permission prompts can be just as dangerous as fake logins.",
      visual_scene_description: "A familiar sign-in screen followed by an app asking for full inbox, drive, and contacts access just to open a file.",
      visual_cues: ["Google sign-in flow", "Broad permissions list", "Unclear app publisher"],
    },
  },
  "fake-browser-update": {
    analysis: {
      risk_level: "High",
      summary: "This resembles a malware delivery attempt disguised as an urgent browser security update.",
      signals_detected: ["Unexpected update pop-up", "Zip file download", "Unofficial source"],
      guidance: [
        "Do not download or run the file.",
        "Update the browser only through its real settings menu or official site.",
        "Run a security scan if anything was downloaded.",
      ],
      confidence_note: "High confidence because fake updates are a common malware lure.",
    },
    story: {
      title: "Critical Update Required",
      short_story: "A fake browser alert pushes the user into downloading a zip file that looks routine but is actually the start of a malware chain.",
      red_flags_spotted: ["Unofficial update path", "Urgent security prompt", "Suspicious download format"],
      lesson_learned: "Real updates come from the app itself, not random web pop-ups.",
      visual_scene_description: "A full-screen browser banner with a flashing warning and a large button to download a security patch zip.",
      visual_cues: ["Pop-up urgency", "Zip installer", "Unknown download domain"],
    },
  },
  "fake-recruiter": {
    analysis: {
      risk_level: "High",
      summary: "This recruiter message uses impersonation and urgency to collect identity and banking data too early.",
      signals_detected: ["Major-company claim", "SSN request", "Expiring offer pressure"],
      guidance: [
        "Do not send SSN or bank information.",
        "Verify through the real careers site.",
        "Ask for a verified company email thread.",
      ],
      confidence_note: "High confidence because legitimate recruiters do not collect this data in informal chat.",
    },
    story: {
      title: "Fast-Track Offer",
      short_story: "A polished message pretends the job is already secured so the user skips the normal caution that real hiring would trigger.",
      red_flags_spotted: ["Impersonation", "Sensitive onboarding ask", "Urgency"],
      lesson_learned: "Excitement is exactly what this kind of scam tries to exploit.",
      visual_scene_description: "A neat recruiter message with a famous company name and a rush request for direct-deposit details.",
      visual_cues: ["No verified signature", "Bank details too early", "Offer expires today"],
    },
  },
  "fake-profile": {
    analysis: {
      risk_level: "Medium",
      summary: "This account shows fake-profile signals and is pushing private contact around money promises.",
      signals_detected: ["Thin account history", "Guaranteed returns", "DM pressure"],
      guidance: [
        "Do not send money or personal information.",
        "Check whether the profile is linked from a verified source.",
        "Treat guaranteed profit claims as a major warning sign.",
      ],
      confidence_note: "Moderate to high confidence based on authenticity gaps and financial manipulation cues.",
    },
    story: {
      title: "Borrowed Trust",
      short_story: "A polished account mimics authority and status, but the real goal is to move the conversation into a lower-visibility channel and extract money.",
      red_flags_spotted: ["Shallow engagement", "Investment lure", "Private-message push"],
      lesson_learned: "A convincing profile is not the same thing as a trusted source.",
      visual_scene_description: "A glossy social profile with aspirational posts and repeated calls to DM for an exclusive opportunity.",
      visual_cues: ["Low trust signals", "Overdone success claims", "DM for details"],
    },
  },
  "voice-clone": {
    analysis: {
      risk_level: "High",
      summary: "This sounds like an emergency-style voice cloning scam designed to override verification with fear.",
      signals_detected: ["Emergency pressure", "No-callback instruction", "Immediate payment demand"],
      guidance: [
        "Do not send money based on this alone.",
        "Call the person through a trusted number.",
        "Verify with another family member or official source.",
      ],
      confidence_note: "High confidence because panic, secrecy, and money pressure appear together.",
    },
    story: {
      title: "Borrowed Voice",
      short_story: "The message sounds personal enough to trigger panic, but the real attack depends on blocking normal verification for just a few minutes.",
      red_flags_spotted: ["Emotional urgency", "Isolation", "Transfer pressure"],
      lesson_learned: "Fear should slow you down, not speed you up.",
      visual_scene_description: "A transcript or voicemail with frantic background noise and repeated instructions not to call anyone else.",
      visual_cues: ["Panic language", "Secrecy", "Wire request"],
    },
  },
  "support-reset": {
    analysis: {
      risk_level: "High",
      summary: "This is consistent with a tech support scam trying to turn fear into remote access and device control.",
      signals_detected: ["Fake support identity", "Malware infection claim", "Remote access request"],
      guidance: [
        "Do not install the remote tool.",
        "Hang up and contact support through the official company website if needed.",
        "Disconnect the device from the network if software was installed.",
      ],
      confidence_note: "High confidence because unsolicited support plus remote access is a classic compromise path.",
    },
    story: {
      title: "Remote Help Trap",
      short_story: "The caller uses technical-sounding warnings to create just enough panic for the user to hand over remote control of the device.",
      red_flags_spotted: ["Unsolicited support call", "Fear-based infection claim", "Remote control request"],
      lesson_learned: "Legitimate support does not cold-call and ask for remote access out of nowhere.",
      visual_scene_description: "A phone call paired with a clean-looking support script and a download page for remote control software.",
      visual_cues: ["Caller claims Microsoft security", "Urgent infection warning", "Install remote tool now"],
    },
  },
};

export function getMockDemo(id: string): MockDemo | null {
  return mockDemos[id] || null;
}
