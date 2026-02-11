# Task List: Financial Advisor App

Based on `prd-financial-advisor.md` and `plan-financial-advisor.md`. Check off each sub-task by changing `- [ ]` to `- [x]` after completing it.

---

## Relevant Files

- `financial_advisor/api/main.py` — FastAPI app, CORS, quote and advise routes.
- `financial_advisor/api/requirements.txt` — Backend dependencies (FastAPI, uvicorn, yfinance, httpx, python-dotenv).
- `financial_advisor/api/.env.example` — Example environment (e.g. `OPENROUTER_API_KEY=`); do not commit real keys.
- `financial_advisor/web/` — Vite + React + TypeScript app (e.g. `src/App.tsx`, `src/main.tsx`, `index.html`).
- `financial_advisor/web/src/components/QuoteSection.tsx` — Stock search input and quote result card.
- `financial_advisor/web/src/components/AdvisorChat.tsx` — Chat message list and input; calls advise API with optional context.
- `financial_advisor/web/src/app/globals.css` (or `src/index.css`) — Midnight Editorial theme (colors, fonts, selection).
- `financial_advisor/web/tailwind.config.js` (or `tailwind.config.ts`) — Theme extension for coral, background, etc.
- `financial_advisor/web/components.json` — shadcn/ui configuration.
- `financial_advisor/api/tests/test_quote.py` — Optional: tests for GET /api/quote.
- `financial_advisor/api/tests/test_advise.py` — Optional: tests for POST /api/advise (e.g. mock OpenRouter).

### Notes

- Unit/integration tests can live under `financial_advisor/api/tests/`. Use `pytest` from the `api` directory (e.g. `cd financial_advisor/api && pytest`). Frontend tests can be added later (e.g. Vitest) if desired.
- Run backend: `cd financial_advisor/api && uvicorn main:app --reload`. Run frontend: `cd financial_advisor/web && npm run dev`. Ensure frontend origin is allowed by CORS.

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off in this file by changing `- [ ]` to `- [x]`. Update after each sub-task, not only after a full parent task.

---

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch (e.g. `git checkout -b feature/financial-advisor`).

- [x] 1.0 Set up backend (financial_advisor/api)
  - [x] 1.1 Create folder `financial_advisor/api` and add `requirements.txt` with FastAPI, uvicorn, yfinance, httpx, python-dotenv.
  - [x] 1.2 Create FastAPI app in `main.py` with CORS middleware allowing the frontend origin (e.g. http://localhost:5173).
  - [x] 1.3 Add a simple root or health route (e.g. GET `/` or `/health`) to verify the server runs.
  - [x] 1.4 Load `OPENROUTER_API_KEY` from environment (e.g. via python-dotenv from `.env`); fail or warn if missing when advise is used.

- [x] 2.0 Implement quote API (GET /api/quote)
  - [x] 2.1 Add GET `/api/quote` with query param `symbol`; use yfinance to fetch the ticker.
  - [x] 2.2 Return JSON with: symbol, company name (or short name), current price, change percent, day low, day high, volume.
  - [x] 2.3 Handle invalid symbol and yfinance/network errors; return appropriate status (e.g. 404 or 422) and a clear error message.

- [x] 3.0 Implement advise API (POST /api/advise)
  - [x] 3.1 Add POST `/api/advise` with body: `message` (required), optional `symbol`, optional `quote_summary`.
  - [x] 3.2 Call OpenRouter chat/completion API with model `google/gemini-2.5-flash`, using `OPENROUTER_API_KEY` from env.
  - [x] 3.3 Send a system prompt that defines the assistant as a financial advisor and includes a disclaimer (no guarantee of returns; recommend consulting a licensed advisor for major decisions).
  - [x] 3.4 Build the user message: include the user’s text and, when provided, append context (e.g. “Current stock: {symbol}, {quote_summary}”). Return the assistant’s reply in JSON.
  - [x] 3.5 Handle OpenRouter errors and timeouts; return a clear error response to the client.

- [x] 4.0 Set up frontend (financial_advisor/web)
  - [x] 4.1 Create `financial_advisor/web` with Vite + React + TypeScript (e.g. `npm create vite@latest web -- --template react-ts` inside `financial_advisor`).
  - [x] 4.2 Add Tailwind CSS and configure the Midnight Editorial palette (e.g. background `#050505`, card `#111111`, accent `#FF6B50`, borders).
  - [x] 4.3 Install and configure shadcn/ui (e.g. `npx shadcn@latest init`) with a dark base; add components needed for the app (e.g. Button, Card, Input, ScrollArea).
  - [x] 4.4 Add Satoshi font (or Inter fallback) and global styles: coral selection, glass-style nav if used, theme variables.

- [x] 5.0 Implement single-page UI (quote + advisor chat)
  - [x] 5.1 Build the single-page layout: top nav (glass style per Midnight Editorial), then Stock quote section, then Ask advisor section.
  - [x] 5.2 Quote section: search input for symbol; on submit or Enter, call GET `/api/quote?symbol=...` and display result in a card (price, change %, company name, day range, volume). Show loading and error states.
  - [x] 5.3 Advisor section: message list (user and assistant messages), input and send button. On send, call POST `/api/advise` with `message` and, when available, `symbol` and `quote_summary` from the last successful quote.
  - [x] 5.4 Style all components with Midnight Editorial (dark cards, coral primary buttons, correct typography and borders).
  - [x] 5.5 Add loading states for quote fetch and advise request; display API errors in the UI with clear, user-friendly messages.
