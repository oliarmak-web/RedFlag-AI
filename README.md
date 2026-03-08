# RedFlag AI

**See it. Ask it. Understand the risk.**

RedFlag AI is a full-stack Google Cloud hackathon prototype for scam and manipulation detection with a creative educational story layer.

## What it demonstrates
- Real-world usefulness: phishing and scam risk triage
- Multimodal reasoning: text, links, screenshots/images
- Structured AI output: strict JSON responses
- Optional live interaction: browser microphone transcript capture
- Deployment readiness: Docker + Cloud Run commands

## Project structure
```text
.
+- frontend/
¦  +- app/
¦  +- .env.example
¦  +- Dockerfile
¦  +- package.json
+- backend/
¦  +- app/
¦  ¦  +- routers/
¦  ¦  +- services/
¦  ¦  +- config.py
¦  ¦  +- models.py
¦  ¦  +- prompts.py
¦  ¦  +- main.py
¦  +- .env.example
¦  +- Dockerfile
¦  +- requirements.txt
¦  +- main.py
+- Dockerfile
+- requirements.txt
+- .env.example
+- README.md
```

## Required API routes
- `GET /health`
- `POST /analyze-text`
- `POST /analyze-image`
- `POST /analyze-link`
- `POST /generate-story`

## Prompt templates
Prompt templates are in:
- `backend/app/prompts.py`

They enforce JSON response formats:

### Analysis JSON
```json
{
  "risk_level": "Low | Medium | High",
  "summary": "short plain-language summary",
  "signals_detected": ["signal 1", "signal 2", "signal 3"],
  "guidance": ["safe next step 1", "safe next step 2"],
  "confidence_note": "brief note"
}
```

### Story JSON
```json
{
  "title": "story title",
  "short_story": "short educational narrative showing how the scam or manipulation could unfold",
  "red_flags_spotted": ["red flag 1", "red flag 2"],
  "lesson_learned": "short takeaway"
}
```

## Demo data included in UI
- Phishing email
- Suspicious QR code
- Fake recruiter message
- Fake social media profile
- Family emergency voice-cloning transcript

## Local setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example` and set:
```bash
GEMINI_API_KEY=your_google_genai_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Run backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
```

Create `frontend/.env.local` from `frontend/.env.example`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Run frontend:
```bash
npm run dev
```

Open `http://localhost:3000`.

## Google GenAI setup
1. Create/enable API key for Gemini.
2. Put key in backend `.env` as `GEMINI_API_KEY`.
3. Optional: change `GEMINI_MODEL` (default `gemini-2.0-flash`).

## Docker local run

### Backend container
```bash
docker build -t redflag-backend -f backend/Dockerfile backend
docker run --rm -p 8000:8080 --env-file backend/.env redflag-backend
```

### Frontend container
```bash
docker build -t redflag-frontend -f frontend/Dockerfile frontend
docker run --rm -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 redflag-frontend
```

## Google Cloud Run deployment

### Backend deploy
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud run deploy redflag-ai-backend \
  --source ./backend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_API_KEY,GEMINI_MODEL=gemini-2.0-flash
```

Save backend URL, e.g. `https://redflag-ai-backend-xxxxx-uc.a.run.app`.

### Frontend deploy
```bash
gcloud run deploy redflag-ai-frontend \
  --source ./frontend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_BASE_URL=https://redflag-ai-backend-xxxxx-uc.a.run.app
```

## Quick demo steps
1. Open RedFlag AI.
2. Load one of the built-in sample cases.
3. Click **Analyze** and discuss risk level + guidance.
4. Click **Generate Story** to show educational narrative output.
