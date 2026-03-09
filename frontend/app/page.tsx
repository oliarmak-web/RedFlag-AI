"use client";

import { ChangeEvent, useRef, useState } from "react";

import { demoCases } from "@/lib/demoCases";
import { getMockDemo } from "@/lib/mockData";
import { AnalysisResult, StoryResult } from "@/lib/types";

const demoModeDefault = process.env.NEXT_PUBLIC_DEMO_MODE_DEFAULT !== "false";
const demoModeLocked = process.env.NEXT_PUBLIC_DEMO_MODE_LOCK === "true";

function looksLikeUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function riskClass(level: AnalysisResult["risk_level"] | undefined): string {
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
  const [demoMode, setDemoMode] = useState(demoModeDefault);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAnalyze = Boolean(selectedFile) || inputText.trim().length > 2;

  const resetOutputs = () => {
    setAnalysis(null);
    setStory(null);
    setError("");
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setInputText("");
    setSelectedDemoId(null);
    resetOutputs();
  };

  const onAnalyze = async () => {
    if (!canAnalyze) return;

    setAnalyzing(true);
    resetOutputs();

    try {
      if (demoMode && selectedDemoId) {
        const mockDemo = getMockDemo(selectedDemoId);
        if (mockDemo) {
          setAnalysis(mockDemo.analysis);
          setStory(null);
          return;
        }
      }

      if (demoModeLocked) {
        setError("This public Cloud Run demo is locked to the built-in sample scenarios so it stays free to run.");
        return;
      }

      let endpoint = "/api/analyze-text";
      let body: BodyInit;
      let headers: HeadersInit = { "Content-Type": "application/json" };

      if (selectedFile) {
        endpoint = "/api/analyze-image";
        headers = {};
        const formData = new FormData();
        formData.append("file", selectedFile);
        body = formData;
      } else if (looksLikeUrl(inputText)) {
        endpoint = "/api/analyze-link";
        body = JSON.stringify({ url: inputText.trim() });
      } else {
        body = JSON.stringify({ text: inputText.trim() });
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Analysis failed.");
      }

      setAnalysis(payload as AnalysisResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not analyze content.");
    } finally {
      setAnalyzing(false);
    }
  };

  const onGenerateStory = async () => {
    if (!analysis) return;

    setStoryLoading(true);
    setError("");

    try {
      if (demoMode && selectedDemoId) {
        const mockDemo = getMockDemo(selectedDemoId);
        if (mockDemo) {
          setStory(mockDemo.story);
          return;
        }
      }

      if (demoModeLocked) {
        setError("This public Cloud Run demo is locked to built-in scenarios, so live Gemini story calls are disabled.");
        return;
      }

      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: analysis.summary,
          risk_level: analysis.risk_level,
          signals_detected: analysis.signals_detected,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Story generation failed.");
      }

      setStory(payload as StoryResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not generate story.");
    } finally {
      setStoryLoading(false);
    }
  };

  const onDemoClick = (id: string, value: string) => {
    setInputText(value);
    setSelectedFile(null);
    setSelectedDemoId(id);
    resetOutputs();
  };

  const onMicrophone = () => {
    const speechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!speechRecognitionClass) {
      setError("Speech recognition is not supported in this browser. Paste a transcript instead.");
      return;
    }

    const recognition = new speechRecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInputText(transcript);
      setSelectedFile(null);
      setSelectedDemoId(null);
      setError("");
    };

    recognition.onerror = () => {
      setError("Microphone capture failed. You can paste the voice transcript manually.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Live Scam Triage + Storytelling Demo</p>
          <h1>RedFlag AI</h1>
          <p className="tagline">See it. Ask it. Understand the risk.</p>
        </div>
        <div className="hero-note">
          <span className="stat-kicker">One demo link</span>
          <strong>Next.js on Cloud Run</strong>
          <p>One hosted app, optional live Gemini mode, and a locked free demo path for judges.</p>
        </div>
      </section>

      <section className="workspace-grid">
        <section className="card composer-card">
          <div className="section-copy">
            <h2>Live Agent Mode</h2>
            <p>Paste text, upload a screenshot, scan a suspicious link, or capture a voice-cloning transcript.</p>
          </div>

          <div className="demo-mode-bar">
            <label className="mode-toggle">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(event) => setDemoMode(event.target.checked)}
                disabled={demoModeLocked}
              />
              <span>{demoModeLocked ? "Free demo mode is locked on" : "Use free instant demo mode"}</span>
            </label>
            <p>
              {demoModeLocked
                ? "This Cloud Run deployment is locked to built-in scenarios, so anyone opening the link can demo the app without consuming Gemini credits."
                : demoMode
                  ? "Built-in sample outputs are used for the demo buttons, so judges can click through without spending Gemini credits."
                  : "Real Gemini calls run when you analyze content or generate a story."}
            </p>
          </div>

          <div className="demo-strip">
            {demoCases.map((demo) => (
              <button
                key={demo.id}
                type="button"
                className={`demo-chip ${selectedDemoId === demo.id ? "demo-chip-active" : ""}`}
                onClick={() => onDemoClick(demo.id, demo.value)}
              >
                <span>{demo.label}</span>
                <small>{demo.category}</small>
              </button>
            ))}
          </div>

          <textarea
            className="main-input"
            rows={8}
            placeholder="Paste a suspicious message, link, QR-code context, profile description, or voice transcript..."
            value={inputText}
            onChange={(event) => {
              setInputText(event.target.value);
              setSelectedDemoId(null);
              if (event.target.value) {
                setSelectedFile(null);
              }
            }}
          />

          <div className="toolbar-row">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden-input" onChange={onFileChange} />
            <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>
              {selectedFile ? `Selected: ${selectedFile.name}` : "Upload Screenshot / Image"}
            </button>
            <button type="button" className="secondary-button" onClick={onMicrophone} disabled={isListening}>
              {isListening ? "Listening..." : "Use Microphone"}
            </button>
            {selectedFile && (
              <button type="button" className="ghost-button" onClick={() => setSelectedFile(null)}>
                Clear image
              </button>
            )}
          </div>

          <button type="button" className="primary-button" disabled={!canAnalyze || analyzing} onClick={onAnalyze}>
            {analyzing ? "Analyzing risk..." : demoMode && selectedDemoId ? "Analyze with demo data" : "Analyze"}
          </button>

          {error && <p className="error-banner">{error}</p>}
        </section>

        <section className="card pipeline-card">
          <h2>Demo Talking Points</h2>
          <div className="pipeline-block">
            <span>Original pipeline</span>
            <p>Frontend to FastAPI backend to Google Gemini SDK to structured JSON risk analysis to story generation to Cloud Run deployment.</p>
          </div>
          <div className="pipeline-block highlight-block">
            <span>Current pipeline</span>
            <p>Next.js UI to Next.js API routes on Cloud Run to Google Gemini JS SDK to structured JSON analysis plus story plus visual scene, with an optional locked free demo mode.</p>
          </div>
          <div className="pipeline-block">
            <span>Storytelling angle</span>
            <p>The story mode now explains how the scam unfolds and what the user would actually see, including fake QR posters, recruiter messages, or cloned-emergency prompts.</p>
          </div>
        </section>
      </section>

      {analysis && (
        <section className={`card result-card ${riskClass(analysis.risk_level)}`}>
          <div className="result-header">
            <div>
              <p className="eyebrow">Structured AI Output</p>
              <h2>Risk Assessment</h2>
            </div>
            <span className={`risk-pill ${riskClass(analysis.risk_level)}`}>{analysis.risk_level} Risk</span>
          </div>

          <p className="summary-text">{analysis.summary}</p>

          <div className="result-columns">
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
                {analysis.guidance.map((guide) => (
                  <li key={guide}>{guide}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="confidence-line">Confidence note: {analysis.confidence_note}</p>

          <button type="button" className="primary-button story-button" onClick={onGenerateStory} disabled={storyLoading}>
            {storyLoading ? "Generating educational story..." : demoMode && selectedDemoId ? "Generate demo story" : "Generate Story"}
          </button>
        </section>
      )}

      {story && (
        <section className="story-layout">
          <section className="card story-card">
            <p className="eyebrow">Creative Story Mode</p>
            <h2>{story.title}</h2>
            <p>{story.short_story}</p>

            <h3>Red Flags Spotted</h3>
            <ul>
              {story.red_flags_spotted.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>

            <h3>Lesson Learned</h3>
            <p>{story.lesson_learned}</p>
          </section>

          <section className="card visual-card">
            <p className="eyebrow">How This Scam Might Look</p>
            <div className="mock-scene">
              <div className="mock-scene-header">
                <span className="mock-badge">Scene Preview</span>
                <span className="mock-badge muted-badge">Educational</span>
              </div>
              <p>{story.visual_scene_description}</p>
            </div>
            <h3>Visual Cues</h3>
            <ul>
              {story.visual_cues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </section>
        </section>
      )}
    </main>
  );
}
