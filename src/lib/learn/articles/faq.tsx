import { LearnProse } from "@/components/learn/LearnProse";
import { LEARN_FAQ_ITEMS } from "@/lib/learn/articles/faq-data";

export function FaqContent() {
  return (
    <LearnProse>
      <p>
        Common questions about invoices, bills, billing, USDT payments, bank transfers, security and VegaPal features.
      </p>

      {LEARN_FAQ_ITEMS.map((item) => (
        <section key={item.question} aria-labelledby={`faq-${item.question.replace(/\W+/g, "-").toLowerCase()}`}>
          <h2 id={`faq-${item.question.replace(/\W+/g, "-").toLowerCase()}`} className="!text-xl !mt-8">
            {item.question}
          </h2>
          <p>{item.answer}</p>
        </section>
      ))}
    </LearnProse>
  );
}
