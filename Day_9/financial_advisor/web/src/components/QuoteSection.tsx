import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchQuote, type QuoteResponse } from '@/lib/api'
import { Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

type QuoteSectionProps = {
  onQuoteLoaded: (symbol: string, summary: string) => void
}

export function QuoteSection({ onQuoteLoaded }: QuoteSectionProps) {
  const [symbol, setSymbol] = useState('')
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const s = symbol.trim().toUpperCase()
    if (!s) return
    setError(null)
    setLoading(true)
    try {
      const data = await fetchQuote(s)
      setQuote(data)
      const summary = `$${data.current_price}${data.change_percent != null ? ` (${data.change_percent >= 0 ? '+' : ''}${data.change_percent}%)` : ''}`
      onQuoteLoaded(data.symbol, summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote')
      setQuote(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Stock quote
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          placeholder="e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-card border-border text-foreground placeholder:text-muted-foreground flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>
      {error && (
        <p className="text-destructive text-sm mb-4" role="alert">
          {error}
        </p>
      )}
      {quote && (
        <Card className="bg-card border-border hover:bg-[#161616] transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-foreground">
              {quote.company_name}
            </CardTitle>
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              {quote.symbol}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${quote.current_price.toFixed(2)}
              </span>
              {quote.change_percent != null && (
                <span
                  className={
                    quote.change_percent >= 0
                      ? 'text-primary flex items-center gap-1'
                      : 'text-destructive flex items-center gap-1'
                  }
                >
                  {quote.change_percent >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {quote.change_percent >= 0 ? '+' : ''}
                  {quote.change_percent}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>
                <span className="uppercase tracking-wider">Day range</span>
                <p className="text-foreground font-medium">
                  ${quote.day_low.toFixed(2)} – ${quote.day_high.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="uppercase tracking-wider">Volume</span>
                <p className="text-foreground font-medium">
                  {quote.volume != null
                    ? quote.volume.toLocaleString()
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
