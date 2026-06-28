import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import type { LearnGuideCard } from "@/lib/learn/popular-guides";

type LearnPopularGuidesProps = {
  guides: LearnGuideCard[];
};

export function LearnPopularGuides({ guides }: LearnPopularGuidesProps) {
  return (
    <section aria-labelledby="popular-invoice-guides">
      <h2 id="popular-invoice-guides" className="text-2xl font-bold tracking-tight text-foreground">
        Popular invoice guides
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
        In-depth articles on invoices, bills, generators, and software—written for freelancers and small businesses.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <article
            key={guide.path}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated"
          >
            <Link to={guide.path} className="block group h-full">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <FileText className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{guide.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Read guide →</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
