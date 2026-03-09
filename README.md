# RedFlag AI

**See it. Ask it. Understand the risk.**

RedFlag AI is a hackathon demo for scam detection and safety storytelling. The app analyzes suspicious text, screenshots, links, and voice-style transcripts, then generates structured safety guidance and a short educational story that explains how the scam could unfold.

## What changed
The project is now set up for a smoother public demo flow:
- One deployable Next.js app in `frontend/`
- Gemini calls handled in Next.js API routes
- Designed to deploy from GitHub to Vercel as a single service
- No separate backend URL required for the demo link

## Current demo architecture
```text
Browser UI
  -> Next.js app
  -> /api/analyze-text
  -> /api/analyze-link
  -> /api/analyze-image
  -> /api/generate-story
  -> Gemini via Google GenAI JavaScript SDK
  -> Structured JSON returned to the UI
```

## Hackathon pipeline story
### Original pipeline you can describe
- Next.js frontend captured text, images, links, and optional voice transcript input.
- A FastAPI backend handled the API routes.
- Google Gemini was called through the Google SDK for multimodal scam analysis.
- The backend returned structured JSON with risk level, summary, detected signals, guidance, and confidence note.
- A second Gemini prompt generated the creative educational story layer.
- The intended deploy target was Google Cloud Run with environment-based config.

### New pipeline you can describe now
- The UI is still Next.js, but the backend logic now lives inside Next.js API routes.
- Gemini is called directly on the server side using the Google GenAI JavaScript SDK.
- The app returns structured JSON for analysis and for the story card.
- Story mode now also produces a visual scene description and visual cues so you can explain what scam setups, such as fake QR-code posters, would look like during the demo.
- The whole experience can deploy as one GitHub-connected Vercel app for a cleaner demo link.

## Story mode upgrade
Story generation now includes:
- `title`
- `short_story`
- `red_flags_spotted`
- `lesson_learned`
- `visual_scene_description`
- `visual_cues`

That means QR scams, fake recruiter messages, and impersonation attempts can be shown not just as text, but as a guided explanation of what the user would actually see.

## Local run
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local` with:
```bash
GEMINI_API_KEY=your_google_genai_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Open `http://localhost:3000`.

## Vercel deploy
1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Set the Vercel Root Directory to `frontend`.
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL=gemini-2.0-flash`
5. Deploy.

## Main routes
- `GET /api/health`
- `POST /api/analyze-text`
- `POST /api/analyze-link`
- `POST /api/analyze-image`
- `POST /api/generate-story`
