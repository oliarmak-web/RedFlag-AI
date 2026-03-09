# RedFlag AI

**See it. Ask it. Understand the risk.**

RedFlag AI is a hackathon demo for scam detection and safety storytelling. The app analyzes suspicious text, screenshots, links, and voice-style transcripts, then generates structured safety guidance and a short educational story that explains how the scam could unfold.

## Recommended deployment path now
The project is now optimized for a single-service deployment on Google Cloud Run.

That gives you:
- one public demo link
- one Next.js app handling both UI and API routes
- optional live Gemini mode
- optional locked free demo mode for judges

## Current architecture
```text
Browser UI
  -> Next.js app on Cloud Run
  -> /api/analyze-text
  -> /api/analyze-link
  -> /api/analyze-image
  -> /api/generate-story
  -> Gemini via Google GenAI JavaScript SDK
  -> Structured JSON returned to the UI
```

## Hackathon pipeline story
### Original pipeline
- Next.js frontend captured text, links, screenshots, and optional voice transcript input.
- FastAPI handled backend routes.
- Gemini was called through the Google SDK for multimodal analysis.
- The backend returned structured JSON for risk level, summary, signals, guidance, and confidence note.
- A second Gemini prompt generated the creative story layer.
- The intended host was Google Cloud Run with a split frontend/backend setup.

### Current pipeline
- Next.js still drives the UI.
- Next.js API routes now act as the backend.
- Gemini is called server-side with the Google GenAI JavaScript SDK.
- Story mode includes both narrative output and a visual scene description.
- The app can run on Cloud Run either in live Gemini mode or in a locked free demo mode.

## Free demo mode
Free demo mode is meant for judge-facing public links.

When `NEXT_PUBLIC_DEMO_MODE_LOCK=true`:
- the app stays in demo mode
- built-in sample buttons use instant mock outputs
- custom live Gemini analysis is blocked
- you can deploy without consuming Gemini credits during the demo flow

This is the safest public demo setup.

## Environment variables
### For a free public demo on Cloud Run
```bash
NEXT_PUBLIC_DEMO_MODE_DEFAULT=true
NEXT_PUBLIC_DEMO_MODE_LOCK=true
```

Gemini variables are optional in this mode because built-in sample scenarios do not call Gemini.

### For live Gemini mode on Cloud Run
```bash
GEMINI_API_KEY=your_google_genai_api_key
GEMINI_MODEL=gemini-2.0-flash
NEXT_PUBLIC_DEMO_MODE_DEFAULT=false
NEXT_PUBLIC_DEMO_MODE_LOCK=false
```

### Mixed mode
```bash
GEMINI_API_KEY=your_google_genai_api_key
GEMINI_MODEL=gemini-2.0-flash
NEXT_PUBLIC_DEMO_MODE_DEFAULT=true
NEXT_PUBLIC_DEMO_MODE_LOCK=false
```

That lets you start in free demo mode but still toggle into live mode yourself.

## Local run
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local` with either the free demo or live mode values above.

Open `http://localhost:3000`.

## Cloud Run deploy
### Option 1: Free public demo mode
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud run deploy redflag-ai \
  --source ./frontend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_DEMO_MODE_DEFAULT=true,NEXT_PUBLIC_DEMO_MODE_LOCK=true
```

### Option 2: Live Gemini mode
```bash
gcloud run deploy redflag-ai \
  --source ./frontend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_API_KEY,GEMINI_MODEL=gemini-2.0-flash,NEXT_PUBLIC_DEMO_MODE_DEFAULT=false,NEXT_PUBLIC_DEMO_MODE_LOCK=false
```

### Option 3: Hybrid mode
```bash
gcloud run deploy redflag-ai \
  --source ./frontend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_API_KEY,GEMINI_MODEL=gemini-2.0-flash,NEXT_PUBLIC_DEMO_MODE_DEFAULT=true,NEXT_PUBLIC_DEMO_MODE_LOCK=false
```

## Main routes
- `GET /api/health`
- `POST /api/analyze-text`
- `POST /api/analyze-link`
- `POST /api/analyze-image`
- `POST /api/generate-story`
