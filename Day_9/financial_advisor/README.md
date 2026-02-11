# Financial Advisor

Stock quote lookup (yfinance) + AI advisor chat (OpenRouter Gemini 2.5 Flash). Single-page React + FastAPI app with Midnight Editorial design.

## Setup

### Backend

```bash
cd financial_advisor/api
python3 -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Set your OpenRouter API key. From repo root (or inside `api/`):

```bash
# .env at repo root or financial_advisor/api/.env
OPENROUTER_API_KEY=your_key_here
```

Run the API:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd financial_advisor/web
npm install
npm run dev
```

Open http://localhost:5173. The app calls the API at `http://localhost:8000` by default. Override with `VITE_API_URL` in `.env` if needed.

## Features

- **Stock quote:** Enter a symbol (e.g. AAPL) to see price, change %, day range, volume.
- **Ask advisor:** Type a question; the AI gets context from your last quote when available.
- **Design:** Midnight Editorial (dark theme, coral accent).

## Task list

See `/tasks/tasks-financial-advisor.md` for the implementation checklist.
