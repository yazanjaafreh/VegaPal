import type { LearnFaqItem } from "@/lib/learn/types";

export function LearnArticleFaq({ items, heading = "Frequently Asked Questions" }: { items: LearnFaqItem[]; heading?: string }) {
  return (
    <section className="space-y-6" aria-labelledby="learn-article-faq">
      <h2 id="learn-article-faq" className="text-2xl font-bold tracking-tight text-foreground">
        {heading}
      </h2>
      {items.map((item) => {
        const id = `faq-${item.question.replace(/\W+/g, "-").toLowerCase().slice(0, 48)}`;
        return (
          <div key={item.question}>
            <h3 id={id} className="text-lg font-semibold text-foreground">
              {item.question}
            </h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        );
      })}
    </section>
  );
}
