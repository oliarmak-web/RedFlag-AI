import { AnalysisResult, StoryResult } from "./types";

type MockDemo = {
  analysis: AnalysisResult;
  story: StoryResult;
};

export const mockDemos: Record<string, MockDemo> = {
  "phishing-email": {
    analysis: {
      risk_level: "High",
      summary:
        "This message strongly resembles a phishing email using urgency and a suspicious domain to pressure the user into clicking quickly.",
      signals_detected: [
        "Urgent deadline language",
        "Suspicious non-official domain",
        "Account access threat",
      ],
      guidance: [
        "Do not click the link.",
        "Verify the request through your company's real payroll portal.",
        "Report the message to IT or security if this is a workplace account.",
      ],
      confidence_note:
        "High confidence because the message combines classic phishing pressure with a lookalike URL.",
    },
    story: {
      title: "The Two-Hour Payroll Trap",
      short_story:
        "A student receives a message saying payroll access will be suspended unless they verify their login within two hours. Rattled by the deadline, they almost click before noticing the web address is slightly off. Instead of reacting to the pressure, they check the real payroll site and confirm no issue exists.",
      red_flags_spotted: [
        "Artificial urgency",
        "Lookalike login domain",
        "Threat of account suspension",
      ],
      lesson_learned:
        "Pressure is part of the scam. Slow down and verify through the real service.",
      visual_scene_description:
        "An email with bold red warning text, a countdown-style deadline, and a fake company login button leading to a slightly altered web address.",
      visual_cues: [
        "Words like 'urgent' and 'suspended today'",
        "A login button paired with a strange domain",
        "Branding that feels close to official but not quite right",
      ],
    },
  },
  "suspicious-qr": {
    analysis: {
      risk_level: "High",
      summary:
        "This QR setup looks risky because it uses a pasted-over code and promises a reward while asking for highly sensitive information.",
      signals_detected: [
        "Sticker placed over another QR code",
        "Reward bait",
        "Requests for SSN and payment details",
      ],
      guidance: [
        "Do not scan or engage with this QR code.",
        "Navigate to the official website manually instead.",
        "Avoid entering financial or identity information from flyer-based QR promotions.",
      ],
      confidence_note:
        "High confidence because physical QR tampering plus personal-data requests is a strong scam pattern.",
    },
    story: {
      title: "The Refund Flyer Switch",
      short_story:
        "A commuter notices a flyer promising a fast tax refund if they scan a QR code. The sticker looks newer than the poster underneath, but the offer feels tempting. Before scanning, they realize the code may redirect to a fake form designed to steal identity and card details, and they leave it alone.",
      red_flags_spotted: [
        "Too-good-to-be-true refund promise",
        "Tampered sticker over an original code",
        "Sensitive details requested after scanning",
      ],
      lesson_learned:
        "A QR code is just a shortcut to a link. Treat it with the same caution as any suspicious URL.",
      visual_scene_description:
        "A bright poster in a public place with a fresh QR sticker pasted crookedly over an older printed code, promising a refund or giveaway in large attention-grabbing text.",
      visual_cues: [
        "Peeling or layered QR sticker",
        "Big reward claims on a public poster",
        "A mobile form asking for identity and debit card details",
      ],
    },
  },
  "fake-recruiter": {
    analysis: {
      risk_level: "High",
      summary:
        "This recruiter message shows impersonation and onboarding scam signals by demanding sensitive information immediately and using an expiring offer to create panic.",
      signals_detected: [
        "Claims to represent a major company",
        "Immediate request for SSN and bank data",
        "Exploding-offer urgency",
      ],
      guidance: [
        "Do not send SSN or banking information.",
        "Verify the recruiter through the company's official careers page.",
        "Ask for communication from a verified company email domain.",
      ],
      confidence_note:
        "High confidence because legitimate recruiters do not rush identity and bank collection over informal outreach.",
    },
    story: {
      title: "The Fast-Track Offer",
      short_story:
        "A promising remote job message lands in a student's inbox, claiming a well-known company wants to hire immediately. The sender asks for SSN and direct-deposit details to 'secure the role today.' The student pauses, checks the official careers site, and finds no recruiter by that name.",
      red_flags_spotted: [
        "Unverified recruiter identity",
        "Sensitive data requested before formal hiring steps",
        "Pressure to act immediately",
      ],
      lesson_learned:
        "Real hiring processes verify identity carefully and do not rush private financial details through chat.",
      visual_scene_description:
        "A polished-looking message with a famous company name, a congratulatory tone, and a demand for private onboarding details before any formal interview process.",
      visual_cues: [
        "Generic recruiter language with no verifiable signature",
        "A request for SSN or bank info too early",
        "Claims that the offer disappears today",
      ],
    },
  },
  "fake-profile": {
    analysis: {
      risk_level: "Medium",
      summary:
        "This profile has multiple fake-account indicators, including shallow engagement, exaggerated claims, and pressure to move to private messages for financial promises.",
      signals_detected: [
        "New or thin account history",
        "Guaranteed profit claims",
        "Push to continue privately in DMs",
      ],
      guidance: [
        "Do not send money or personal details through direct messages.",
        "Check whether the profile is linked from an official verified source.",
        "Be skeptical of guaranteed-return language.",
      ],
      confidence_note:
        "Moderate to high confidence because scam investment accounts often combine authority signals with low-account authenticity.",
    },
    story: {
      title: "The Verified Lookalike",
      short_story:
        "An account that looks polished starts promising followers guaranteed crypto returns and invites everyone into private messages. At first glance it seems legitimate, but the interactions are shallow and the promises are unrealistic. The user realizes the profile is trying to borrow trust, not earn it.",
      red_flags_spotted: [
        "Guaranteed returns",
        "Few authentic interactions",
        "Pressure to move to DMs",
      ],
      lesson_learned:
        "A polished profile is not proof of legitimacy, especially when money is involved.",
      visual_scene_description:
        "A sleek social profile with flashy posts, motivational captions, and repeated calls to DM for exclusive investing access.",
      visual_cues: [
        "Low-comment, low-trust engagement",
        "Over-the-top success language",
        "Repeated private-message prompts tied to money",
      ],
    },
  },
  "voice-clone": {
    analysis: {
      risk_level: "High",
      summary:
        "This transcript matches a possible AI voice-cloning or family-emergency scam using panic, secrecy, and immediate money pressure.",
      signals_detected: [
        "Emergency distress framing",
        "Instruction not to verify by calling back",
        "Immediate money transfer demand",
      ],
      guidance: [
        "Do not send money based on this message alone.",
        "Contact the person directly using a trusted number.",
        "Verify the situation through another family member or official source.",
      ],
      confidence_note:
        "High confidence because secrecy plus urgency plus payment pressure is a classic emergency scam pattern.",
    },
    story: {
      title: "The Borrowed Voice",
      short_story:
        "A parent hears what sounds like their child in crisis, begging for money and insisting no one else be called. The fear feels real, which is exactly what the scam relies on. Instead of wiring funds immediately, the parent calls a trusted family contact and learns the child is safe.",
      red_flags_spotted: [
        "Strong emotional urgency",
        "Isolation from verification",
        "Immediate transfer request",
      ],
      lesson_learned:
        "When fear spikes suddenly, verification matters even more.",
      visual_scene_description:
        "A frantic call or transcript with emotional language, background confusion, and repeated instructions not to contact anyone else before sending money.",
      visual_cues: [
        "Panic-driven language",
        "Requests for secrecy",
        "Immediate financial instructions",
      ],
    },
  },
};

export function getMockDemo(id: string): MockDemo | null {
  return mockDemos[id] || null;
}
