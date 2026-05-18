import { GoogleGenAI, Type, Part } from "@google/genai";
import { NextStepResponse } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    meetingType: { type: Type.STRING },
    summary: { type: Type.STRING },
    executionReadinessScore: { type: Type.NUMBER },
    scoreReason: { type: Type.STRING },
    stepByStepActionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.NUMBER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
      },
    },
    taskBoard: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          owner: { type: Type.STRING },
          deadline: { type: Type.STRING },
          priority: { type: Type.STRING },
          status: { type: Type.STRING },
        },
      },
    },
    decisions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    issuesDetected: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          severity: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
        },
      },
    },
    alternativeSolutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    followUpEmailDraft: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
      },
    },
    calendarEventDraft: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        suggestedDate: { type: Type.STRING },
        agenda: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
  },
};

const systemInstruction = `You are NextStep AI, a meeting-to-action agent.

Your job is to analyze messy meeting input and convert it into a clear execution plan.

The user may provide rough meeting notes, extracted PDF text, image descriptions, whiteboard notes, screenshots, or mixed meeting information.

Analyze the meeting based on the meeting type. Be practical, specific, and action-oriented.

Rules:
- If an owner is not mentioned, use "Unassigned".
- If a deadline is unclear, use "Not specified".
- Give the executionReadinessScore from 0 to 100.
- A high score means the meeting has clear decisions, owners, deadlines, and next steps.
- A low score means the meeting has vague decisions, missing owners, unclear deadlines, or unresolved blockers.
- For Brainstorming meetings, focus more on ideas, themes, promising directions, and next experiments.
- For Product Sync meetings, focus on product decisions, blockers, feature priorities, and release risks.
- For Team Update meetings, focus on progress, blockers, owners, and next tasks.
- For Client Meeting meetings, focus on client concerns, commitments, follow-up actions, and business risks.
- For Investor Meeting meetings, focus on investor questions, traction, risks, follow-ups, and credibility gaps.
- For Student Project meetings, focus on assignments, deadlines, deliverables, and team coordination.
- Keep the follow-up email professional and concise.
- Keep alternative solutions realistic and useful.
- Do not invent exact dates unless they are clearly provided.`;

export async function analyzeMeeting(
  meetingType: string,
  textInput: string,
  base64Files: { data: string; mimeType: string }[]
): Promise<NextStepResponse> {
  const parts: Part[] = [];

  parts.push({
    text: `Meeting type: ${meetingType}\n\nMeeting input:\n${textInput || "See attached files."}`,
  });

  for (const file of base64Files) {
    parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema as any,
      temperature: 0.2, // lower temperature for more consistent JSON structure
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate response");
  }

  return JSON.parse(response.text) as NextStepResponse;
}
