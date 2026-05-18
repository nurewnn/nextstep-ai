export interface ActionPlanStep {
  step: number;
  title: string;
  description: string;
}

export interface Task {
  task: string;
  owner: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Done";
}

export interface Issue {
  issue: string;
  severity: "High" | "Medium" | "Low";
  whyItMatters: string;
}

export interface AlternativeSolution {
  issue: string;
  solutions: string[];
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface CalendarDraft {
  title: string;
  suggestedDate: string;
  agenda: string[];
}

export interface NextStepResponse {
  meetingType: string;
  summary: string;
  executionReadinessScore: number;
  scoreReason: string;
  stepByStepActionPlan: ActionPlanStep[];
  taskBoard: Task[];
  decisions: string[];
  issuesDetected: Issue[];
  alternativeSolutions: AlternativeSolution[];
  missingInformation: string[];
  followUpEmailDraft: EmailDraft;
  calendarEventDraft: CalendarDraft;
}

export type MeetingType = 
  | "Team Update"
  | "Product Sync"
  | "Brainstorming"
  | "Client Meeting"
  | "Investor Meeting"
  | "Student Project";
