export type RiskLevel = "Low" | "Medium" | "High";
export type Gravity = "Critical" | "Elevated" | "Watch";

export type AnalysisResult = {
  risk_level: RiskLevel;
  summary: string;
  signals_detected: string[];
  guidance: string[];
  confidence_note: string;
};

export type StoryResult = {
  title: string;
  short_story: string;
  red_flags_spotted: string[];
  lesson_learned: string;
  visual_scene_description: string;
  visual_cues: string[];
};

export type DemoCase = {
  id: string;
  label: string;
  category: string;
  gravity: Gravity;
  value: string;
};
