import { Link } from "@tanstack/react-router";
import { LEARN_FAQ_ITEMS } from "@/lib/learn/articles/faq-data";

const PREVIEW_COUNT = 6;

export function LearnFaqPreview() {
  const preview = LEARN_FAQ_ITEMS.slice(0, PREVIEW_COUNT);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8" aria-labelledby="faq-preview">
      <h2 id="faq-preview" className="text-2xl font-bold tracking-tight text-foreground">
        Frequently Asked Questions
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Quick answers to common questions about invoices, payments, and VegaPal.
      </p>
      <dl className="mt-6 space-y-5">
        {preview.map((item) => (
          <div key={item.question}>
            <dt className="font-medium text-foreground">{item.question}</dt>
            <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
      <Link to="/learn/faq" className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
        View all FAQs →
      </Link>
    </section>
  );
}
