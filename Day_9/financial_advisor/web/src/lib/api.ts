const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export type QuoteResponse = {
  symbol: string
  company_name: string
  current_price: number
  change_percent: number | null
  day_low: number
  day_high: number
  volume: number | null
}

export async function fetchQuote(symbol: string): Promise<QuoteResponse> {
  const res = await fetch(
    `${API_BASE}/api/quote?symbol=${encodeURIComponent(symbol.trim())}`
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || res.statusText || 'Failed to fetch quote')
  }
  return res.json()
}

export type AdviseRequest = {
  message: string
  symbol?: string
  quote_summary?: string
}

export type AdviseResponse = {
  reply: string
}

export async function fetchAdvise(body: AdviseRequest): Promise<AdviseResponse> {
  const res = await fetch(`${API_BASE}/api/advise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || res.statusText || 'Advisor request failed')
  }
  return res.json()
}
