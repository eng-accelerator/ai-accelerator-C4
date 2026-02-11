# Demo - Different ways of AI Assisted Coding

A collection of apps built using three different development methodologies—each chosen to fit the project’s complexity and requirements.

---

## Overview

| App | Approach | Stack |
|-----|----------|-------|
| **Habit Tracker** | Anti-Gravity (conversational) | Next.js, shadcn/ui |
| **Financial Advisor** | Spec-driven development (Cursor rules) | FastAPI + React, yfinance, OpenRouter |
| **Kanban Board** | GSD (Get Shit Done) framework | Vite, React, Tailwind |

---

## 1. Habit Tracker — Anti-Gravity

Built through **conversational development** with Anti-Gravity: a simple chat-based flow where you describe what you want and the AI produces the app iteratively. No formal PRD or task list; requirements emerge from conversation.

### Run

```bash
cd habit_tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 2. Financial Advisor — Spec-Driven Development

Built with **spec-driven development** and Cursor rules: PRD-first, then a structured task list. The workflow uses:

- **`.cursor/rules/`** — `create-prd.mdc`, `generate-tasks.mdc` — PRD structure and task breakdown.
- **`.cursor/agents/prd-and-tasks-builder.md`** — Agent that runs clarifying questions → PRD → parent tasks → "Go" → sub-tasks.
- **`tasks/`** — `plan-financial-advisor.md`, `prd-financial-advisor.md`, `tasks-financial-advisor.md`.

Process: define requirements → write PRD → generate tasks → implement.

### Run

**Backend**

```bash
cd financial_advisor/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Set OPENROUTER_API_KEY in .env (repo root or api/)
uvicorn main:app --reload --port 8000
```

**Frontend**

```bash
cd financial_advisor/web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app uses stock quotes (yfinance) and an AI advisor (OpenRouter Gemini 2.5 Flash).

---

## 3. Kanban Board — GST Framework

Built with the **GST (Get Shit Done)** framework: a phased workflow (discovery → research → plan → execute → verify) for structured execution.

- **`.claude/get-shit-done/`** — Workflows, agents (planner, executor, verifier, etc.), and templates.
- Phased flow: `new-project` → `plan-phase` → `execute-phase` → `verify-phase`.
- Designed for projects that need research, milestones, and verification.

### Run

```bash
cd kanban_board
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (Vite default). A drag-and-drop Kanban board with columns, task cards, and filtering.

---

## Structure

```
├── habit_tracker/          # Anti-Gravity → conversational build
├── financial_advisor/      # Spec-driven → PRD + tasks
│   ├── api/               # FastAPI (quote, advise)
│   └── web/               # React + shadcn
├── kanban_board/          # GST → phased workflow
├── tasks/                 # Plans, PRDs, task lists (spec-driven)
├── .cursor/               # Cursor rules and agents (spec-driven)
└── .claude/               # GST framework (workflows, commands, agents)
```

---

## Methodology Summary

- **Anti-Gravity**: Chat-first, iterative. Good for quick prototypes and straightforward apps.
- **Spec-driven (Cursor rules)**: PRD → tasks → implementation. Good for features with clear scope and handoff.
- **GSD**: Research, plan, execute, verify. Good for larger or research-heavy projects.
