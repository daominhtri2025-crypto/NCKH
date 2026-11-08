export interface Participant {
  code: string;
  class_code: string;
}

export interface ScenarioSummary {
  id: string;
  title: string;
  summary: string;
  status: 'new' | 'answered';
  attempts: number;
  first_try_safe: boolean | null;
}

export interface Module1Overview {
  module: number;
  title: string;
  content_version: string;
  scenarios: ScenarioSummary[];
  progress: {
    total: number;
    answered: number;
    first_try_safe: number;
    score_percent: number;
  };
}

export interface ScenarioMessage {
  from: string;
  text: string;
}

export interface ScenarioChoice {
  index: number;
  text: string;
}

export interface ScenarioDetail {
  id: string;
  title: string;
  summary: string;
  messages: ScenarioMessage[];
  question: string;
  choices: ScenarioChoice[];
}

export interface AnswerResult {
  attempt_no: number;
  is_first_attempt: boolean;
  choice_index: number;
  is_safe: boolean;
  feedback: string;
  best_choice_index: number | null;
  red_flags: string[];
  takeaway: string;
}

export interface Module2Item {
  id: string;
  url: string;
  host: string;
  root_domain: string;
  position: number;
  status: 'new' | 'answered';
  correct: boolean | null;
  button_order: 'official_first' | 'fake_first';
}

export interface Module2Overview {
  module: number;
  title: string;
  content_version: string;
  rule: { name: string; steps: string[] };
  official_roots: string[];
  reference_note: string;
  items: Module2Item[];
  progress: {
    total: number;
    answered: number;
    correct: number;
    accuracy_percent: number;
  };
}

export type Verdict = 'official' | 'fake';

export interface Module2Result {
  item_id: string;
  verdict: Verdict;
  correct: boolean;
  is_official: boolean;
  root_domain: string;
  trick: string;
  explanation: string;
  official_roots: string[];
}

export interface Module3Step {
  id: string;
  title: string;
  instruction: string;
  why: string;
  quiz: { question: string; options: string[] };
  status: 'open' | 'passed';
  attempts: number;
}

export interface Module3Overview {
  module: number;
  title: string;
  content_version: string;
  disclaimer: string;
  platforms: { id: string; name: string; steps: Module3Step[] }[];
  progress: { total_steps: number; passed_steps: number; score_percent: number };
  lab: { passed: boolean; attempts: number };
}

export interface Module3StepResult {
  item_id: string;
  attempt_no: number;
  is_first_attempt: boolean;
  passed: boolean;
  correct_choice: number;
  explanation: string;
}

export type PhaseName = 'pre' | 'post' | 'delayed';

export interface PhaseState {
  phase: PhaseName;
  status: 'open' | 'in_progress' | 'done' | 'locked';
  answered: number;
  total: number;
  locked_reason: string | null;
  available_at: string | null;
}

export interface AssessmentStatus {
  title: string;
  intro: string;
  content_version: string;
  behavior_scale: string[];
  phases: Record<PhaseName, PhaseState>;
  modules: { m1: boolean; m2: boolean; m3: boolean; all: boolean };
}

export interface AssessmentItemView {
  id: string;
  instrument: 'knowledge' | 'behavior';
  question: string;
  options?: string[];
  answered: boolean;
}

export interface AssessmentPhaseView {
  phase: PhaseName;
  state: PhaseState;
  items: AssessmentItemView[];
}
