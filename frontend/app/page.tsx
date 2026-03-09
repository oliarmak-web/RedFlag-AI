"use client";

import { ChangeEvent, useRef, useState } from "react";

import { demoCases } from "@/lib/demoCases";
import { getMockDemo } from "@/lib/mockData";
import { AnalysisResult, Gravity, StoryResult } from "@/lib/types";

const demoModeDefault = process.env.NEXT_PUBLIC_DEMO_MODE_DEFAULT !== "false";
const demoModeLocked = process.env.NEXT_PUBLIC_DEMO_MODE_LOCK === "true";
const gravityOrder: Gravity[] = ["Critical", "Elevated", "Watch"];

const startupFeatures = [
  {
    title: "Shield Mode",
    body: "Stops risky actions before the tap with short warnings like Do not scan or Verify first.",
  },
  {
    title: "Trusted Circle",
    body: "One-tap verification flow for family, friends, and emergency contacts when a message feels urgent.",
  },
  {
    title: "Memory",
    body: "Learns repeated attack patterns for a user and raises faster alerts when the same scam shape comes back.",
  },
  {
    title: "Community Signal",
    body: "Optional shared pattern matching across users so new scam templates can be flagged earlier.",
  },
  {
    title: "High-Risk Stop",
    body: "A hard interruption screen for the highest-risk moments: Do not send. Do not scan. Verify first.",
  },
];

const wearableFlow = [
  "Wearable catches the moment: suspicious QR, caller, or message cue.",
  "Display devices show a tiny warning. Audio-first devices speak a short prompt.",
  "Phone opens the full RedFlag explanation, guidance, and trusted-circle options.",
];

const wearableDisplayAlerts = [
  {
    title: "QR scan",
    status: "High risk",
    body: "Do not scan. Open phone.",
  },
  {
    title: "Unknown caller",
    status: "Verify first",
    body: "Trusted circle check ready.",
  },
];

const wearableAudioAlerts = [
  {
    title: "Earbud cue",
    status: "Spoken alert",
    body: "Possible scam. Verify before you act.",
  },
  {
    title: "Voice clone",
    status: "Calm prompt",
    body: "Pause. Call your trusted contact directly.",
  },
];

const phoneDashboardItems = [
  {
    label: "Why flagged",
    value: "Urgency + pasted QR sticker + identity data request",
  },
  {
    label: "Recommended",
    value: "Open scan, verify source, do not submit details",
  },
  {
    label: "Fallback",
    value: "Call trusted contact or use an official support channel",
  },
];

const phoneQuickActions = ["Open scan", "Verify contact", "Block", "Save evidence"];

const phoneRecentEvents = [
  "11:42 AM  Audio alert played",
  "11:42 AM  QR marked high risk",
  "11:43 AM  Phone handoff ready",
];

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

function riskLabel(level: AnalysisResult["risk_level"] | undefined): string {
  if (level === "High") return "Act now";
  if (level === "Medium") return "Slow down";
  return "Looks calmer";
}

function gravityClass(gravity: Gravity): string {
  if (gravity === "Critical") return "gravity-critical";
  if (gravity === "Elevated") return "gravity-elevated";
  return "gravity-watch";
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

  const groupedDemoCases = gravityOrder.map((gravity) => ({
    gravity,
    items: demoCases.filter((demo) => demo.gravity === gravity),
  }));

  const actionFeed = analysis
    ? [
        `Status: ${analysis.risk_level} risk detected.`,
        `Primary move: ${analysis.guidance[0] || "Pause before engaging."}`,
        `Wearable cue: ${analysis.risk_level === "High" ? "Do not scan. Verify first." : analysis.risk_level === "Medium" ? "Slow down and check on phone." : "No urgent interrupt needed."}`,
      ]
    : [
        demoModeLocked ? "Status: sample mode active." : demoMode ? "Status: demo mode ready." : "Status: live scan ready.",
        selectedDemoId ? "Queue: sample scenario loaded." : "Queue: waiting for a message, link, or image.",
        "System: alerts stay short, practical, and calm.",
      ];

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
          return;
        }
      }

      if (demoModeLocked) {
        setError("Sample-only mode. Pick a built-in case.");
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
        throw new Error(payload.error || "Scan failed.");
      }

      setAnalysis(payload as AnalysisResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Scan failed.");
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
        setError("Context is sample-only right now.");
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
        throw new Error(payload.error || "Context failed.");
      }

      setStory(payload as StoryResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Context failed.");
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
      setError("Mic unavailable. Paste text instead.");
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
      setError("Mic failed. Paste text instead.");
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
          <p className="eyebrow">Multimodal Digital Trust Assistant</p>
          <h1>RedFlag AI</h1>
          <p className="tagline">A startup building a real-time trust layer for messages, links, screenshots, QR codes, profiles, and voice scams.</p>
        </div>
        <div className={`hero-watch ${riskClass(analysis?.risk_level)}`}>
          <div className="watch-ring">
            <div className="watch-core">
              <span className="watch-state">{analysis?.risk_level || "Standby"}</span>
              <strong>{riskLabel(analysis?.risk_level)}</strong>
            </div>
          </div>
          <p>{analysis ? analysis.summary : "Drop in a signal and get a quick risk read."}</p>
        </div>
      </section>

      <section className="workspace-grid">
        <section className="card composer-card">
          <div className="section-copy">
            <h2>Scan Input</h2>
            <p>Paste, upload, or speak. RedFlag turns noisy signals into brief trust guidance.</p>
          </div>

          <div className="demo-mode-bar compact-bar">
            <label className="mode-toggle">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(event) => setDemoMode(event.target.checked)}
                disabled={demoModeLocked}
              />
              <span>{demoModeLocked ? "Demo locked" : demoMode ? "Demo mode on" : "Live mode on"}</span>
            </label>
            <p>
              {demoModeLocked
                ? "Built-in cases only. No live model calls."
                : demoMode
                  ? "Sample cases return instantly."
                  : "Live Gemini analysis is active."}
            </p>
          </div>

          <div className="gravity-groups">
            {groupedDemoCases.map((group) => (
              <section key={group.gravity} className="gravity-section">
                <div className="gravity-header-row">
                  <span className={`gravity-pill ${gravityClass(group.gravity)}`}>{group.gravity}</span>
                </div>
                <div className="demo-strip">
                  {group.items.map((demo) => (
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
              </section>
            ))}
          </div>

          <textarea
            className="main-input"
            rows={8}
            placeholder="Paste a message, suspicious link, QR setup, profile details, or transcript..."
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
              {selectedFile ? `Image: ${selectedFile.name}` : "Upload image"}
            </button>
            <button type="button" className="secondary-button" onClick={onMicrophone} disabled={isListening}>
              {isListening ? "Listening..." : "Use mic"}
            </button>
            {selectedFile && (
              <button type="button" className="ghost-button" onClick={() => setSelectedFile(null)}>
                Clear
              </button>
            )}
          </div>

          <button type="button" className="primary-button" disabled={!canAnalyze || analyzing} onClick={onAnalyze}>
            {analyzing ? "Scanning..." : demoMode && selectedDemoId ? "Run sample" : "Scan now"}
          </button>

          {error && <p className="error-banner">{error}</p>}
        </section>

        <section className="side-stack">
          <section className="card status-card">
            <p className="eyebrow">Device Status</p>
            <div className="status-grid">
              <div>
                <span className="mini-label">Mode</span>
                <strong>{demoModeLocked ? "Locked" : demoMode ? "Demo" : "Live"}</strong>
              </div>
              <div>
                <span className="mini-label">Channel</span>
                <strong>{selectedFile ? "Image" : selectedDemoId ? "Sample" : inputText ? "Text" : "Idle"}</strong>
              </div>
              <div>
                <span className="mini-label">Risk</span>
                <strong>{analysis?.risk_level || "None"}</strong>
              </div>
              <div>
                <span className="mini-label">Context</span>
                <strong>{story ? "Expanded" : "Brief"}</strong>
              </div>
            </div>
            <div className="device-strip">
              <span className={`device-dot ${riskClass(analysis?.risk_level)}`} />
              <span className="device-text">{analysis ? riskLabel(analysis.risk_level) : "Ambient watch mode"}</span>
            </div>
          </section>

          <section className="card feed-card">
            <p className="eyebrow">Action Feed</p>
            <ul>
              {actionFeed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="card product-card">
            <p className="eyebrow">Startup Layer</p>
            <div className="feature-grid">
              {startupFeatures.map((feature) => (
                <article key={feature.title} className="feature-tile">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="card wearable-card">
            <p className="eyebrow">Wearable Concept</p>
            <p className="wearable-intro">Display glasses can flash a one-line warning. Audio-first wearables can speak a short cue or chime, then hand off the full decision flow to the phone.</p>
            <div className="wearable-concept-grid">
              <section className="wearable-mode-panel">
                <div className="wearable-mode-header">
                  <span className="wearable-mode-tag">Display</span>
                  <h3>Glasses with display</h3>
                </div>
                <div className="wearable-display-grid">
                  {wearableDisplayAlerts.map((alert) => (
                    <article key={alert.title} className="wearable-display-card">
                      <div className="wearable-display-top">
                        <span>{alert.title}</span>
                        <span className="wearable-display-dot" />
                      </div>
                      <strong>{alert.status}</strong>
                      <p>{alert.body}</p>
                    </article>
                  ))}
                </div>
              </section>
              <section className="wearable-mode-panel">
                <div className="wearable-mode-header">
                  <span className="wearable-mode-tag audio-tag">Audio</span>
                  <h3>Wearables without display</h3>
                </div>
                <div className="wearable-audio-grid">
                  {wearableAudioAlerts.map((alert) => (
                    <article key={alert.title} className="wearable-audio-card">
                      <div className="wearable-display-top audio-top">
                        <span>{alert.title}</span>
                        <span className="wearable-audio-wave">~~~</span>
                      </div>
                      <strong>{alert.status}</strong>
                      <p>{alert.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <section className="phone-dashboard-card">
              <div className="wearable-mode-header">
                <span className="wearable-mode-tag phone-tag">Phone</span>
                <h3>Audio warnings dashboard</h3>
              </div>
              <div className="phone-dashboard-shell">
                <div className="phone-dashboard-status">
                  <div>
                    <span className="phone-dashboard-kicker">Live alert</span>
                    <strong>High risk QR detected</strong>
                    <p>Brief wearable cue sent. Full scan ready on phone.</p>
                  </div>
                  <span className="phone-dashboard-pulse">Act now</span>
                </div>
                <div className="phone-dashboard-actions">
                  {phoneQuickActions.map((action) => (
                    <button key={action} type="button" className="phone-action-chip">
                      {action}
                    </button>
                  ))}
                </div>
                <div className="phone-dashboard-grid">
                  {phoneDashboardItems.map((item) => (
                    <article key={item.label} className="phone-dashboard-tile">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </article>
                  ))}
                </div>
                <div className="phone-recent-strip">
                  <span className="phone-dashboard-kicker">Recent events</span>
                  <ul>
                    {phoneRecentEvents.map((event) => (
                      <li key={event}>{event}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
            <div className="wearable-strip">
              <div className="wearable-node">Wearable</div>
              <div className="wearable-arrow">{" > "}</div>
              <div className="wearable-node">Brief alert</div>
              <div className="wearable-arrow">{" > "}</div>
              <div className="wearable-node">Phone</div>
            </div>
            <ul>
              {wearableFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </section>
      </section>

      {analysis && (
        <section className={`card result-card ${riskClass(analysis?.risk_level)}`}>
          <div className="result-header">
            <div>
              <p className="eyebrow">Risk Read</p>
              <h2>{analysis.risk_level} risk</h2>
            </div>
            <span className={`risk-pill ${riskClass(analysis.risk_level)}`}>{riskLabel(analysis.risk_level)}</span>
          </div>

          <p className="summary-text">{analysis.summary}</p>

          <div className="result-columns">
            <article>
              <h3>Signals</h3>
              <ul>
                {analysis.signals_detected.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>Do this</h3>
              <ul>
                {analysis.guidance.map((guide) => (
                  <li key={guide}>{guide}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="confidence-line">{analysis.confidence_note}</p>

          <button type="button" className="primary-button story-button" onClick={onGenerateStory} disabled={storyLoading}>
            {storyLoading ? "Expanding context..." : demoMode && selectedDemoId ? "Open context" : "Expand context"}
          </button>

          {story && (
            <div className="inline-context-grid">
              <section className="inline-context-card">
                <p className="eyebrow">Context</p>
                <h3>{story.title}</h3>
                <p>{story.short_story}</p>
                <h4>Flags</h4>
                <ul>
                  {story.red_flags_spotted.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </section>
              <section className="inline-context-card visual-context-card">
                <p className="eyebrow">Visual Snapshot</p>
                <div className="mock-scene">
                  <div className="mock-scene-header">
                    <span className="mock-badge">Preview</span>
                    <span className="mock-badge muted-badge">Pattern</span>
                  </div>
                  <p>{story.visual_scene_description}</p>
                </div>
                <h4>Cues</h4>
                <ul>
                  {story.visual_cues.map((cue) => (
                    <li key={cue}>{cue}</li>
                  ))}
                </ul>
                <h4>Takeaway</h4>
                <p>{story.lesson_learned}</p>
              </section>
            </div>
          )}
        </section>
      )}
    </main>
  );
}




