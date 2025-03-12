import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center">
        <section className="text-center mb-28 space-y-8 w-full">
          <Badge variant="outline" className="text-sm font-semibold bg-muted text-foreground">
            AI-Powered Meeting Assistant
          </Badge>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground leading-tight">
            Transform Chaos Into<br className="hidden md:block" /> Actionable Clarity
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatically convert messy meeting notes into structured summaries, 
            prioritized tasks, and follow-up reminders. Never miss an action item again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg gap-2 hover:scale-[1.02] transition-transform">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg">
              How It Works
            </Button>
          </div>
        </section>

        <section className="mb-28 w-full">
          <div className="relative rounded-2xl border bg-background p-8 shadow-lg">
            <div className="absolute inset-0 bg-grid-muted/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
            <div className="relative space-y-8 flex flex-col items-center">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">How Meeting Recall Works</h2>
                <p className="text-slate-600">Three simple steps to meeting nirvana</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6 bg-white/50 backdrop-blur-sm">
                  <div className="text-2xl mb-4">1. Upload</div>
                  <p className="text-slate-600">
                    Drag & drop your meeting notes from any source - Google Docs, 
                    email, or plain text
                  </p>
                </Card>
                <Card className="p-6 bg-white/50 backdrop-blur-sm">
                  <div className="text-2xl mb-4">2. Analyze</div>
                  <p className="text-slate-600">
                    Our AI identifies key decisions, action items, and follow-ups
                  </p>
                </Card>
                <Card className="p-6 bg-white/50 backdrop-blur-sm">
                  <div className="text-2xl mb-4">3. Execute</div>
                  <p className="text-slate-600">
                    Get a clear checklist with deadlines and automatic reminders
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-background rounded-2xl p-12 shadow-lg border w-full max-w-3xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Trusted by Teams Worldwide</h2>
            <p className="text-slate-600">
              "Meeting Recall has transformed how we handle post-meeting followups. 
              We've reduced missed action items by 80% and saved countless hours."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="font-semibold">JD</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">John Doe</div>
                <div className="text-sm text-slate-500">CTO at TechCorp</div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
