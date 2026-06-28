import { Link } from "@tanstack/react-router";
import { LEARN_TOPICS } from "@/lib/learn/topics";

export function LearnBrowseTopics() {
  return (
    <section aria-labelledby="browse-by-topic">
      <h2 id="browse-by-topic" className="text-2xl font-bold tracking-tight text-foreground">
        Browse by Topic
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
        Explore product guides, payments, security, and business workflows on VegaPal.
      </p>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {LEARN_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <Link
              key={topic.id}
              to={topic.path}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center shadow-soft transition-all hover:shadow-elevated hover:border-primary/30"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                {topic.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
