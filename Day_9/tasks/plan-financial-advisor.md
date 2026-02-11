# Financial Advisor App — Plan (for your approval)

This document is the **plan only**. No PRD or implementation will start until you confirm or adjust it.

---

## 1. What we're building

- **App name:** Financial Advisor  
- **Backend:** Python **FastAPI** (separate service).  
- **Frontend:** **React** + **shadcn/ui** (separate app; can be Vite or CRA).  
- **Data & AI:** **yfinance** for market/stock data; **OpenRouter** (API key from `.env`) for AI-generated advice.  
- **Design:** **Midnight Editorial** style (dark, editorial typography, coral accent) applied across the app.

---

## 2. Proposed feature set (minimal first version)

Assumption: the app helps users get **stock/market data** and **AI-backed financial guidance** in one place.

| # | Feature | Backend (FastAPI) | Frontend (React + shadcn) | Data / API |
|---|--------|--------------------|---------------------------|------------|
| 1 | **Stock lookup & quote** | Endpoint that accepts a symbol (e.g. AAPL), returns price, change, basic info | Search input + display of quote (current price, change %, maybe 1d range) | **yfinance** |
| 2 | **Portfolio snapshot (optional)** | Endpoint that accepts a list of symbols + optional quantities, returns aggregated view | Simple list/cards of positions with current value and total | **yfinance** |
| 3 | **AI financial advice** | Endpoint that sends user message + optional context (e.g. symbols, portfolio summary) to OpenRouter, returns streaming or single response | Chat-like UI: user types question, sees AI response (e.g. “Should I add more AAPL?”) | **OpenRouter** |
| 4 | **Basic dashboard** | Endpoint(s) for “summary” (e.g. watchlist quotes, last advice) if we want persistence later | Single dashboard page: watchlist + “Ask advisor” entry point | **yfinance** + **OpenRouter** |

**Locked for v1:**  
Only **stock quote** (feature 1) + **AI advisor chat** (feature 3). No portfolio snapshot or dashboard in v1.

**Out of scope for v1 (we add later):**  
Auth/login, persistent portfolios in DB, historical charts, real-time streaming quotes, mobile app.

---

## 3. Architecture (high level)

```
┌─────────────────────────────────────────────────────────────────┐
│  React app (Vite) — Midnight Editorial UI, shadcn components     │
│  - Stock quote view (search + display)                           │
│  - “Ask advisor” chat UI                                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP (e.g. fetch/axios)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  FastAPI backend                                                 │
│  - GET  /api/quote?symbol=AAPL     → yfinance                     │
│  - POST /api/advise                → body: { message, context? }   │
│        → OpenRouter (google/gemini-2.5-flash), key from .env      │
└─────────────────────────────────────────────────────────────────┘
```

- **Layout:** Everything under one parent folder **`financial_advisor/`** at repo root:
  - **`financial_advisor/api/`** — FastAPI backend (`requirements.txt`: FastAPI, uvicorn, yfinance, httpx).
  - **`financial_advisor/web/`** — React + Vite + Tailwind + shadcn frontend.
- **Env:** Backend reads `OPENROUTER_API_KEY` from `.env` (project root or `financial_advisor/api/`). Frontend only talks to backend; no API key in the browser.
- **OpenRouter model:** **Gemini Flash** — use OpenRouter model ID `google/gemini-2.5-flash` (closest to “Gemini 3 Flash”; switch in config if you prefer another Flash ID).

---

## 4. Design system — Midnight Editorial in our context

Use your reference as the **visual language**; we adapt copy and layout to “Financial Advisor” instead of “Superdesign”.

- **Colors**
  - Background: `#050505`
  - Surface/cards: `#111111`, `#161616` on hover
  - Borders: `#222222`, `#333333`
  - Text: primary `#ebebeb` / white, secondary `#888888`, muted `#666666`, `#444444`
  - Accent (CTAs, highlights, links): `#FF6B50` (coral)
- **Typography**
  - Font: **Satoshi** (variable) with **Inter** fallback (as in your reference).
  - Headings: bold, tight tracking, large sizes (e.g. hero-style for main title, smaller for section titles).
  - Uppercase labels: small (e.g. 10px), letter-spacing, `#666` or `#FF6B50`.
- **UI patterns**
  - **Nav:** Top bar, glass style: `rgba(17,17,17,0.8)`, blur, border `rgba(255,255,255,0.1)`.
  - **Cards:** Dark cards `#111111`, rounded (e.g. `2.5rem`), subtle border; hover to `#161616`.
  - **Buttons:** Primary = coral `#FF6B50`, hover darker; secondary = dark fill + border `#333`, hover to white text/background.
  - **Selection:** Coral highlight (`::selection` with `#FF6B50`).
- **Components**
  - Build the React app with **shadcn/ui** (Button, Card, Input, etc.) and **theme them** to the above: dark background, coral primary, same borders and type scale so the app feels like “Midnight Editorial” for finance.

So: same design system as your HTML reference, applied to dashboard, quote view, and advisor chat.

---

## 5. Locked decisions (from your confirmation)

| Item | Choice |
|------|--------|
| **Feature scope** | Stock quote + AI advisor chat only |
| **Project layout** | All under `financial_advisor/` — `api/` (FastAPI) + `web/` (React) |
| **OpenRouter model** | Gemini Flash → `google/gemini-2.5-flash` |
| **Design** | Midnight Editorial consistent across the app |

Once you answer (e.g. “1B, 2A, 3A, 4A” or with short notes), the next step is: **clarifying questions for the PRD → PRD → task list (parent tasks → you say “Go” → sub-tasks)**. No code will be written until you’re happy with this plan and we’ve done the PRD + tasks.

---

## Summary

| Item | Proposal |
|------|----------|
| **Backend** | FastAPI in `financial_advisor/api/`, yfinance, OpenRouter (key from .env) |
| **Frontend** | React + Vite + shadcn in `financial_advisor/web/`, themed to Midnight Editorial |
| **v1 features** | Stock quote + AI advisor chat only |
| **Design** | Midnight Editorial applied consistently |
| **Next step** | Answer PRD questions below → PRD → task list (parent → "Go" → sub-tasks) |

---

## 6. PRD clarifying questions (answer these so we can write the PRD)

Please pick options (e.g. 1A, 2B, 3A, 4A):

1. **Stock quote — what to show**  
   - **A)** Minimal: current price, change % (and direction), company name.  
   - **B)** A bit more: the above + day range (low–high), volume.  
   - **C)** Whatever yfinance returns for a single symbol (we display the main fields).

2. **AI advisor — system prompt / disclaimer**  
   - **A)** Yes: give the model a short system prompt (e.g. “You are a financial advisor. Do not guarantee returns; suggest users consult a licensed advisor for major decisions.”).  
   - **B)** No: keep it neutral, no fixed persona or disclaimer.

3. **Advisor context — current stock**  
   - **A)** Yes: when the user has looked up a symbol, send it (and optionally the quote summary) as context to the advisor so they can say “What do you think about AAPL?”.  
   - **B)** No: only send the user’s message; no automatic quote context.

4. **Frontend layout**  
   - **A)** Single page: one view with two sections — “Stock quote” (search + result) and “Ask advisor” (chat).  
   - **B)** Two routes: e.g. `/` for quote and `/advise` for chat (with a nav link between them).
