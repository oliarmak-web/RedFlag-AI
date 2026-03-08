"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";

type RiskLevel = "Low" | "Medium" | "High";

type AnalysisResult = {
  risk_level: RiskLevel;
  summary: string;
  signals_detected: string[];
  guidance: string[];
  confidence_note: string;
};

type StoryResult = {
  title: string;
  short_story: string;
  red_flags_spotted: string[];
  lesson_learned: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const demoCases = [
  {
    id: "phishing-email",
    label: "Phishing Email",
    value:
      "Subject: Urgent account verification needed\n\nYour payroll access will be suspended in 2 hours unless you re-verify your login at http://secure-payroll-check.info.",
  },
  {
    id: "suspicious-qr",
    label: "Suspicious QR Code",
    value:
      "A printed flyer says: 'Scan this QR now to claim your free tax refund'. The QR sticker looks pasted over another code and asks for SSN and debit card details.",
  },
  {
    id: "fake-recruiter",
    label: "Fake Recruiter",
    value:
      "Hi, I am from Google hiring team. We need your SSN and bank info immediately to process onboarding for a remote role. Offer expires today.",
  },
  {
    id: "fake-profile",
    label: "Fake Social Profile",
    value:
      "Profile claims to be a verified celebrity investor, has a new account, very few real interactions, and keeps pushing followers to DM for guaranteed crypto returns.",
  },
  {
    id: "voice-clone",
    label: "Voice-Cloning Transcript",
    value:
      "Mom it's me. I had an accident and my phone died. Please do not call anyone. I need you to wire $3000 right now to this account before police process me.",
  },
] as const;

function looksLikeUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return !!parsed.hostname;
  } catch {
    return false;
  }
}

function riskClass(level: RiskLevel | undefined): string {
  if (level === "High") return "risk-high";
  if (level === "Medium") return "risk-medium";
  return "risk-low";
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAnalyze = useMemo(
    () => Boolean(selectedFile) || inputText.trim().length > 2,
    [inputText, selectedFile],
  );

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setInputText("");
    setAnalysis(null);
    setStory(null);
    setError("");
  };

  const onAnalyze = async () => {
    if (!canAnalyze) return;

    setAnalyzing(true);
    setError("");
    setAnalysis(null);
    setStory(null);

    try {
      let endpoint = "/analyze-text";
      let body: BodyInit;
      let headers: HeadersInit = { "Content-Type": "application/json" };

      if (selectedFile) {
        endpoint = "/analyze-image";
        headers = {};
        const formData = new FormData();
        formData.append("file", selectedFile);
        body = formData;
      } else if (looksLikeUrl(inputText)) {
        endpoint = "/analyze-link";
        body = JSON.stringify({ url: inputText.trim() });
      } else {
        body = JSON.stringify({ text: inputText.trim() });
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const failure = await response.text();
        throw new Error(failure || "Analysis failed.");
      }

      const payload: AnalysisResult = await response.json();
      setAnalysis(payload);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(`Could not analyze content: ${message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const onGenerateStory = async () => {
    if (!analysis) return;

    setStoryLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/generate-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: analysis.summary,
          signals_detected: analysis.signals_detected,
          risk_level: analysis.risk_level,
        }),
      });

      if (!response.ok) {
        const failure = await response.text();
        throw new Error(failure || "Story generation failed.");
      }

      const payload: StoryResult = await response.json();
      setStory(payload);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(`Could not generate story: ${message}`);
    } finally {
      setStoryLoading(false);
    }
  };

  const onDemoClick = (value: string) => {
    setInputText(value);
    setSelectedFile(null);
    setAnalysis(null);
    setStory(null);
    setError("");
  };

  const onMicrophone = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInputText(transcript);
      setSelectedFile(null);
      setError("");
    };

    recognition.onerror = () => {
      setError("Microphone capture failed. You can paste a transcript manually.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <main className="page">
      <section className="hero card">
        <p className="eyebrow">Multimodal Scam Safety Agent</p>
        <h1>RedFlag AI</h1>
        <p className="tagline">See it. Ask it. Understand the risk.</p>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Live Agent Mode</h2>
          <p>Paste suspicious text or links, upload screenshots/images, or capture a quick voice transcript.</p>
        </div>

        <div className="demo-row">
          {demoCases.map((demo) => (
            <button
              key={demo.id}
              className="chip"
              onClick={() => onDemoClick(demo.value)}
              type="button"
            >
              {demo.label}
            </button>
          ))}
        </div>

        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value) setSelectedFile(null);
          }}
          placeholder="Paste suspicious email, message, profile details, QR context, transcript, or link..."
          rows={7}
          className="input"
        />

        <div className="actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden-input"
          />
          <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            {selectedFile ? `Image: ${selectedFile.name}` : "Upload Screenshot/Image"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onMicrophone} disabled={isListening}>
            {isListening ? "Listening..." : "Use Microphone (Optional)"}
          </button>
          {selectedFile && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setSelectedFile(null)}
            >
              Clear Image
            </button>
          )}
        </div>

        <button type="button" className="btn btn-primary full" onClick={onAnalyze} disabled={!canAnalyze || analyzing}>
          {analyzing ? "Analyzing Risk..." : "Analyze"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </section>

      {analysis && (
        <section className={`card result ${riskClass(analysis.risk_level)}`}>
          <div className="result-head">
            <h2>Risk Assessment</h2>
            <span className={`risk-pill ${riskClass(analysis.risk_level)}`}>
              {analysis.risk_level} Risk
            </span>
          </div>

          <p>{analysis.summary}</p>

          <div className="result-grid">
            <article>
              <h3>Signals Detected</h3>
              <ul>
                {analysis.signals_detected.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </article>

            <article>
              <h3>Guidance</h3>
              <ul>
                {analysis.guidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="confidence">Confidence note: {analysis.confidence_note}</p>

          <button type="button" className="btn btn-primary" onClick={onGenerateStory} disabled={storyLoading}>
            {storyLoading ? "Generating Story..." : "Generate Story"}
          </button>
        </section>
      )}

      {story && (
        <section className="card story-card">
          <h2>Creative Story Mode</h2>
          <h3>{story.title}</h3>
          <p>{story.short_story}</p>

          <h4>Red Flags Spotted</h4>
          <ul>
            {story.red_flags_spotted.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>

          <h4>Lesson Learned</h4>
          <p>{story.lesson_learned}</p>
        </section>
      )}
    </main>
  );
}
