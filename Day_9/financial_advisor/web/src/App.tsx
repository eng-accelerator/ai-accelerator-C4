import { useState } from 'react'
import { QuoteSection } from '@/components/QuoteSection'
import { AdvisorChat } from '@/components/AdvisorChat'

function App() {
  const [lastSymbol, setLastSymbol] = useState<string | null>(null)
  const [lastQuoteSummary, setLastQuoteSummary] = useState<string | null>(null)

  function handleQuoteLoaded(symbol: string, summary: string) {
    setLastSymbol(symbol)
    setLastQuoteSummary(summary)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Glass nav */}
      <nav className="sticky top-0 z-50 px-6 py-6 flex items-center justify-between text-sm font-medium bg-[rgba(17,17,17,0.8)] backdrop-blur-xl border-b border-border">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-extrabold text-xl">
            F
          </div>
          <span className="font-bold tracking-tight">Financial Advisor</span>
        </a>
      </nav>

      <main className="px-6 py-12 max-w-4xl mx-auto space-y-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Quote &amp; ask
          </h1>
          <p className="mt-4 text-muted-foreground text-sm max-w-md mx-auto">
            Look up a stock, then ask the AI advisor anything. Context from your
            last quote is included automatically.
          </p>
        </header>

        <QuoteSection onQuoteLoaded={handleQuoteLoaded} />

        <AdvisorChat
          lastSymbol={lastSymbol}
          lastQuoteSummary={lastQuoteSummary}
        />
      </main>
    </div>
  )
}

export default App
