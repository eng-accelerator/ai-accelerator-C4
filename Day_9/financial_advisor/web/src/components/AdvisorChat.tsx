import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchAdvise } from '@/lib/api'
import { Send, Loader2, Bot, User } from 'lucide-react'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type AdvisorChatProps = {
  lastSymbol: string | null
  lastQuoteSummary: string | null
}

export function AdvisorChat({
  lastSymbol,
  lastQuoteSummary,
}: AdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setError(null)
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const { reply } = await fetchAdvise({
        message: text,
        ...(lastSymbol && { symbol: lastSymbol }),
        ...(lastQuoteSummary && { quote_summary: lastQuoteSummary }),
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Advisor request failed')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not get a response. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Ask advisor
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        General guidance only. Not investment advice. Consult a licensed advisor
        for major decisions.
      </p>
      <ScrollArea className="flex-1 min-h-[240px] max-h-[400px] rounded-lg border border-border bg-card p-4 mb-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ask a question about a stock or investing. If you’ve looked up a
              stock above, I’ll have that context.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === 'user'
                  ? 'flex justify-end'
                  : 'flex justify-start'
              }
            >
              <div
                className={
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[85%]'
                    : 'bg-muted text-foreground rounded-lg px-4 py-2 max-w-[85%]'
                }
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.role === 'user' ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {m.role === 'user' ? 'You' : 'Advisor'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      {error && (
        <p className="text-destructive text-sm mb-2" role="alert">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-card border-border text-foreground placeholder:text-muted-foreground flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </section>
  )
}
