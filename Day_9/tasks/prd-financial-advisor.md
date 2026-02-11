# Product Requirements Document: Financial Advisor App

## 1. Introduction / Overview

The **Financial Advisor** app is a single-page web application that helps users look up stock quotes and get AI-powered financial guidance in one place. Users can search for a stock by ticker symbol (e.g. AAPL), see key quote details (price, change, day range, volume), and ask an AI advisor questions—with the option to have the advisor consider the stock they just looked up. The app does not store portfolios or user accounts; it focuses on lookup + advice only.

**Problem:** Users want quick stock data and simple, conversational financial guidance without switching between tools.

**Goal:** Deliver a minimal, fast experience: stock quote lookup plus an AI advisor chat, with a consistent dark “Midnight Editorial” design.

---

## 2. Goals

- Allow users to look up a stock by symbol and see current price, change %, company name, day range (low–high), and volume.
- Allow users to ask the AI advisor questions and receive clear, conversational answers.
- When the user has looked up a stock, automatically provide that symbol and quote summary as context to the advisor so questions like “What do you think about AAPL?” work without re-entering data.
- Present a single-page layout (quote section + chat section) with a consistent Midnight Editorial visual style.
- Keep the backend stateless (no auth, no stored portfolios) and use only yfinance and OpenRouter (Gemini Flash) with API key from `.env`.

---

## 3. User Stories

- **As a user,** I can enter a stock symbol (e.g. AAPL) and see the current price, change %, company name, day range, and volume so that I get a quick snapshot of the stock.
- **As a user,** I can type a question in the advisor chat and get an AI response so that I can get informal financial guidance.
- **As a user,** after looking up a stock, I can ask the advisor about that stock (e.g. “What do you think about it?”) and the advisor will have context about the symbol and quote so that I don’t have to repeat myself.
- **As a user,** I see one page with both the quote area and the chat area so that I can switch between looking up stocks and asking questions without changing pages.
- **As a user,** I see clear disclaimers that the advisor does not guarantee returns and that I should consult a licensed advisor for major decisions, so that I understand the limits of the tool.

---

## 4. Functional Requirements

1. **Stock quote**
   - The system must allow the user to enter a stock ticker symbol and trigger a quote lookup.
   - The system must display: current price, change % (and direction, e.g. up/down), company name, day range (low–high), and volume.
   - The system must show a clear error or message when the symbol is invalid or the quote cannot be fetched.

2. **Quote API**
   - The backend must expose a GET endpoint (e.g. `/api/quote?symbol=AAPL`) that returns the above quote fields, using yfinance.
   - The response must be JSON and include at least: symbol, company name (or short name), current price, change percent, day low, day high, volume.

3. **AI advisor**
   - The system must provide a chat-style interface where the user can type a message and receive a single AI reply.
   - The backend must expose a POST endpoint (e.g. `/api/advise`) that accepts the user message and optional context (e.g. current symbol and quote summary).
   - The backend must call OpenRouter with model `google/gemini-2.5-flash`, using `OPENROUTER_API_KEY` from environment (e.g. `.env`). The API key must not be exposed to the frontend.
   - The backend must send a system prompt that: (a) defines the assistant as a financial advisor, and (b) states that it does not guarantee returns and recommends consulting a licensed advisor for major decisions.

4. **Advisor context**
   - When the user has performed a quote lookup in the current session, the frontend must send the last-searched symbol and a short quote summary (e.g. price, change %) as context to the advise endpoint so the AI can reference that stock when answering.

5. **Layout and design**
   - The app must be a single page with two main sections: (1) Stock quote (search input + quote result), (2) Ask advisor (chat input + message list).
   - The UI must follow the Midnight Editorial design system: background `#050505`, cards/surfaces `#111111`, accent `#FF6B50`, Satoshi/Inter typography, glass-style top nav, coral CTAs and selection highlight. shadcn/ui components must be themed to this system.

6. **Errors and loading**
   - The system must show loading states during quote fetch and during advisor request.
   - The system must show user-friendly error messages when the quote API or the advise API fails (e.g. invalid symbol, network error, OpenRouter error).

---

## 5. Non-Goals (Out of Scope)

- User authentication, login, or accounts.
- Storing portfolios, watchlists, or chat history on the server.
- Historical price charts or multi-day data.
- Real-time streaming quotes or WebSockets.
- Mobile-native app; the product is a responsive web app.
- Portfolio snapshot or dashboard (multiple symbols at once) in v1.

---

## 6. Design Considerations

- **Reference:** The “Midnight Editorial” style is defined in the plan document (`plan-financial-advisor.md`): dark background, coral accent `#FF6B50`, Satoshi (with Inter fallback), glass nav, dark cards with rounded corners, coral buttons and selection.
- **Single page:** One scrollable view: top area for stock quote (search + result card), below it the “Ask advisor” section (chat messages + input). No separate routes for quote vs. chat.
- **Components:** Use shadcn/ui (Button, Card, Input, etc.) and theme them to the Midnight Editorial palette and typography so the app feels consistent and editorial.
- **Accessibility:** Ensure sufficient contrast (light text on dark background) and focus states for keyboard users.

---

## 7. Technical Considerations

- **Structure:** All code lives under `financial_advisor/`: `financial_advisor/api/` for FastAPI, `financial_advisor/web/` for React (Vite) + Tailwind + shadcn.
- **Backend:** Python 3.x, FastAPI, uvicorn, yfinance, httpx (or similar) for calling OpenRouter. Load `OPENROUTER_API_KEY` from `.env` (project root or `api/` folder). CORS must allow requests from the frontend origin.
- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui. Frontend only calls the backend; it must not contain or expose the OpenRouter API key.
- **OpenRouter:** Use the chat/completion API with model ID `google/gemini-2.5-flash`. Send system prompt in the request; include user message and optional context (e.g. “Current stock: AAPL, price 185.50, change +1.2%”) in the user role or a structured context field as per OpenRouter’s API.

---

## 8. Success Metrics

- User can successfully look up at least one valid symbol and see all required quote fields (price, change %, name, day range, volume).
- User can send a message to the advisor and receive a relevant, non-empty response within a reasonable time (e.g. under ~10 seconds under normal conditions).
- When a quote has been loaded, the advisor’s response can reference that stock when the user asks (e.g. “What do you think about it?”).
- No API key is exposed in the browser; all OpenRouter calls go through the backend.
- UI matches the Midnight Editorial style (dark theme, coral accent, correct fonts) across the single page.

---

## 9. Open Questions

- None at this time. Scope is locked to stock quote + AI advisor chat on a single page with Midnight Editorial design; PRD answers (1B, 2A, 3A, 4A) are reflected above.
