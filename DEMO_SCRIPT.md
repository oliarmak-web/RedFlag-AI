# RedFlag AI - Demo Script

**Pitch:** "RedFlag AI is your multimodal safety agent that stops scams before they start. Because simple warnings aren't enough, we show you exactly how the trap is set."

## Pre-Requisites
1. Backend running (`uvicorn main:app --reload` on port 8000).
2. Frontend running (`npm run dev` on port 3000).
3. Browser open to `http://localhost:3000`.

## Scenario 1: The Panic Phish (Text Input)
1. Tell the judges: *"Imagine you receive a frantic text or email from your bank."*
2. Click **Demo: Phishing Link** on the UI.
   - Text populates: *"URGENT: Your bank account will be closed in 24 hours. Click here to verify your identity: http://secure-update-login.com/verify"*
3. Click **Analyze**.
4. Show the results:
   - High risk score (Red badge).
   - Shows the generated summary.
   - Points out "Urgency language" and "Suspicious URL".
5. Say: *"Instead of just saying 'don't click', let's see why."*
6. Click **Generate Educational Story**.
7. Read the generated story showing to the judges how clicking the link leads to a fake portal, credential theft, and account drain.
   
## Scenario 2: AI Voice Cloning Scam Transcription (Text Input)
1. Tell the judges: *"What if you get a scary phone call from a family member in trouble?"*
2. Click **Demo: Voice Scam Transcript** on the UI.
   - Text populates: *"Hey mom, it's me. I lost my phone and I'm using a friend's. I'm in trouble and need you to wire $500 right away for bail. Please don't call my old number..."*
3. Click **Analyze**.
4. Show results:
   - High risk score.
   - Highlights the signals: "Emergency bail excuse", "Refusal to be contacted back on known numbers".
   - Guidance: "Hang up. Call their known phone number."
   
## Scenario 3: The Fake Screenshot or QR Code (Image Upload)
*(Have an example fake package delivery SMS screenshot or a fake recruiter email screenshot ready on your laptop.)*
1. Click **Upload Screenshot** in the UI.
2. Select your test image.
3. Show that the text field is disabled/cleared because it relies entirely on multimodal Gemini.
4. Click **Analyze**.
5. Wait for the result and highlight that Gemini accurately read the text *from* the image and diagnosed the scam type.
6. Click **Generate Educational Story** and share the final impact lesson.

## Closing Statement
*"RedFlag AI: See it. Ask it. Understand the risk. By combining multimodal detection with creative storytelling, we don't just alert users—we educate them for life."*
