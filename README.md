# NextStep AI

NextStep AI is a Gemini-powered multimodal meeting-to-action agent. It helps teams turn messy meeting notes, uploaded images, and PDFs into a clear execution plan with **editable tasks**, risks, missing information, alternative solutions, and follow-up drafts.

This project is built for the **Milan AI Week Hackathon Google/Gemini challenge**. The goal is to show how Gemini can act as a practical reasoning assistant for students, startups, and small teams.

## Problem

Meetings often end with useful information scattered across rough notes, screenshots, whiteboards, PDFs, or chat messages. This creates common problems:

- Important decisions are forgotten.
- Tasks are unclear or missing owners.
- Deadlines are vague.
- Risks and blockers are noticed too late.
- Teams spend extra time writing follow-up messages.
- Small teams lose momentum after discussions.

This is especially painful for student teams, hackathon teams, early-stage startups, and small business teams that do not have a dedicated project manager.

## Solution

NextStep AI turns meeting input into an interactive execution board.

Users first choose a meeting type, then add their input through text, image upload, or PDF upload. Gemini analyzes the content and produces structured, actionable output. 

The agent returns:

- Meeting summary & Key Decisions
- Execution readiness score
- Step-by-step action plan
- **Editable Task Board** (modify task priority, status, description, owner, and deadline directly in the UI)
- Issues and risks detected
- Alternative solutions for key issues
- Missing information
- Gmail-style follow-up draft
- Calendar event draft

Instead of only summarizing notes, NextStep AI helps users decide what to do next and refine the plan instantly.

## Meeting Types

The app supports different meeting types so the experience can adapt to the user context. Each meeting type dynamically changes the page's color theme, text-box title, example input, and Gemini's analysis context:

1. **Team Update**
2. **Product Sync**
3. **Brainstorming**
4. **Client Meeting**
5. **Investor Meeting**
6. **Student Project**

## Multimodal Input

NextStep AI is designed to support:

- **Text notes**
- **Images**, such as whiteboards, screenshots, or handwritten notes
- **PDFs**, such as meeting minutes, project documents, or reports

*Note: Voice input and direct Gmail/Calendar integrations are planned as future improvements.*

## Why Gemini

Gemini is used as the main reasoning engine. It helps the app:

- Understand messy natural language notes.
- Analyze uploaded image or PDF content using strong multimodal capabilities.
- Extract decisions, tasks, owners, and deadlines.
- Detect risks, blockers, and missing details.
- Suggest alternative solutions.
- Generate context-aware follow-up email drafts and calendar event drafts.

This makes the prototype more than a basic note summarizer. It becomes a lightweight agent that turns meeting information into actionable next steps.

## Agent Workflow

1. User chooses a meeting type.
2. The app updates its UI theme and context based on the selected meeting type.
3. User enters notes or uploads images/PDFs.
4. The app sends the input through the Gemini API.
5. Gemini analyzes the content and returns a structured JSON schema.
6. The app renders the result as a dynamic, brutalist-styled Action Board.
7. **User edits tasks** directly on the board if they want to adjust priorities, owners, or statuses.
8. User copies the follow-up draft, calendar draft, or acts on the task list.

## Prototype Features

- Step-by-step UI with dynamic brutalist and colorful design
- Meeting type selection with theme changes
- Text, Image, and PDF upload support
- Gemini-powered structured JSON analysis
- **Fully Editable Task Board** (Edit task name, owner, priority, status, and deadline)
- Step-by-step Action Planner
- Risk, Issue, and Missing Information detectors
- Alternative solution generator
- One-click copy for Gmail-style follow-up drafts and Calendar event drafts
- Smooth animations using Framer Motion

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Framer Motion (for animations), Lucide React (for icons)
- **AI Model:** Gemini API (`@google/genai` SDK)
- **Deployment & Environment:** Google Cloud Run / AI Studio Build

## Target Users

- Student project teams
- Hackathon teams
- Startup founders
- Product teams
- Sales teams
- Small business teams
- Managers who need quick action plans after meetings

## Business Value

NextStep AI saves time after meetings and reduces confusion. It helps teams:

- Capture decisions more reliably
- Turn messy notes into assigned tasks instantly
- Adjust and refine plans on the fly
- Identify risks early
- Think through alternative solutions
- Write follow-up messages quickly
- Prepare calendar-ready next steps

## Future Improvements

- Voice note upload and transcription
- Direct Gmail and Google Calendar API integration
- Export tasks directly to Google Tasks, Notion, Jira, or Trello
- Meeting history and user authentication
- Multilingual meeting support
- Team collaboration dashboard with real-time multiplayer editing

## Hackathon Pitch

NextStep AI helps teams turn messy meetings into execution. Users can paste notes or upload images and PDFs. Gemini analyzes the content and creates an interactive action board with editable tasks, owners, deadlines, risks, missing information, alternative solutions, and follow-up drafts. It helps students, startups, and small teams move from conversation to action instantly.
