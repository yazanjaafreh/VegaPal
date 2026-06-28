import { Sparkles } from "lucide-react";

export function LearnAiPlaceholder() {
  return (
    <section
      className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 sm:p-8 text-center"
      aria-labelledby="ask-vegapal-ai"
    >
      <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Sparkles className="h-6 w-6" aria-hidden />
      </div>
      <h2 id="ask-vegapal-ai" className="mt-4 text-xl font-bold tracking-tight text-foreground">
        Ask VegaPal AI
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">Coming Soon</p>
      <p className="mt-3 text-xs text-muted-foreground max-w-lg mx-auto">
        AI-powered answers about invoicing, payments, and your VegaPal account will appear here.
      </p>
    </section>
  );
}
