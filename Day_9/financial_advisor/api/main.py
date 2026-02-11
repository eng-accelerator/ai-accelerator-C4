"""
Financial Advisor API: stock quote (yfinance) + AI advise (OpenRouter).
"""
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

# Load .env from api dir and from repo root (parent of financial_advisor)
load_dotenv()
root_env = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(root_env)

import yfinance as yf
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Financial Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
ADVISOR_MODEL = "google/gemini-2.5-flash"

SYSTEM_PROMPT = """You are a helpful financial advisor. You provide general information and perspective on stocks and investing. You do not guarantee returns or give personalized investment advice. For major financial decisions, you recommend that users consult a licensed financial advisor. Keep responses clear and concise."""


# --- Health ---

@app.get("/")
def root():
    return {"status": "ok", "service": "financial-advisor-api"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# --- Quote ---

@app.get("/api/quote")
def get_quote(symbol: str = Query(..., min_length=1, max_length=20)):
    symbol = symbol.strip().upper()
    if not symbol:
        raise HTTPException(status_code=422, detail="Symbol is required")
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")
        if hist.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No quote data found for symbol '{symbol}'. Check the symbol and try again.",
            )
        row = hist.iloc[-1]
        open_price = float(row["Open"]) if row["Open"] == row["Open"] else None
        close = float(row["Close"])
        high = float(row["High"])
        low = float(row["Low"])
        volume = int(row["Volume"]) if row["Volume"] == row["Volume"] else None
        change_pct = None
        if open_price and open_price != 0:
            change_pct = round((close - open_price) / open_price * 100, 2)
        name = info.get("shortName") or info.get("longName") or symbol
        return {
            "symbol": symbol,
            "company_name": name,
            "current_price": round(close, 2),
            "change_percent": change_pct,
            "day_low": round(low, 2),
            "day_high": round(high, 2),
            "volume": volume,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Could not fetch quote for '{symbol}'. Please try again later.",
        ) from e


# --- Advise ---

class AdviseRequest(BaseModel):
    message: str = Field(..., min_length=1)
    symbol: Optional[str] = None
    quote_summary: Optional[str] = None


class AdviseResponse(BaseModel):
    reply: str


@app.post("/api/advise", response_model=AdviseResponse)
async def advise(req: AdviseRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Advisor service is not configured (missing OPENROUTER_API_KEY).",
        )
    user_content = req.message.strip()
    if req.symbol or req.quote_summary:
        context_parts = []
        if req.symbol:
            context_parts.append(f"Current stock: {req.symbol}")
        if req.quote_summary:
            context_parts.append(f"Quote summary: {req.quote_summary}")
        user_content = "\n\n".join([user_content, "Context: " + "; ".join(context_parts)])
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]
    payload = {
        "model": ADVISOR_MODEL,
        "messages": messages,
        "max_tokens": 1024,
    }
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
        if r.status_code != 200:
            err = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
            msg = err.get("error", {}).get("message", r.text) or f"OpenRouter error: {r.status_code}"
            raise HTTPException(status_code=502, detail=msg)
        data = r.json()
        choices = data.get("choices") or []
        if not choices:
            raise HTTPException(status_code=502, detail="No response from advisor.")
        reply = choices[0].get("message", {}).get("content") or ""
        return AdviseResponse(reply=reply.strip())
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Advisor request timed out. Please try again.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail="Advisor is temporarily unavailable.") from e
