import React from "react";
import { TimelineEvent } from "@/lib/types/blog";
import { Award, Briefcase, FolderGit2, ExternalLink } from "lucide-react";

interface MyTimelineComponentProps {
  events?: TimelineEvent[];
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    year: 2026,
    category: "milestone",
    title: "Main Founder & Director @ Luis Dev Limited",
    description:
      "Directing premier Nigerian software engineering and technology consulting agency building full-stack products, enterprise systems, and AI automation.",
    link: "https://luisdev.ng",
    order: 1,
  },
  {
    id: "2",
    year: 2026,
    category: "milestone",
    title: "Co-founder @ MyInvite",
    description:
      "Co-founded streamlined event management platform with high-throughput QR attendee check-ins and compliant payment processing.",
    link: "https://myinvite.ng",
    order: 2,
  },
];

const MyTimelineComponent: React.FC<MyTimelineComponentProps> = ({
  events = DEFAULT_EVENTS,
}) => {
  // Group by year
  const years = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "milestone":
        return <Briefcase className="w-3.5 h-3.5 text-blue-500" />;
      case "project":
        return <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "achievement":
        return <Award className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "milestone":
        return "Career Milestone";
      case "project":
        return "Major Project";
      case "achievement":
        return "Published Achievement";
      default:
        return category;
    }
  };

  return (
    <section className="w-full py-12 border-b border-border/60">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Timeline / Experience
        </h2>
        <p className="text-sm text-muted-foreground">
          Milestones, proprietary platforms, and major systems engineered throughout my career.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-border/70 space-y-12">
        {years.map((year) => {
          const yearEvents = events.filter((e) => e.year === year);
          return (
            <div key={year} className="relative">
              {/* Year Node on timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 flex items-center justify-center">
                <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                  {year}
                </span>
              </div>

              {/* Year's Events */}
              <div className="pt-8 sm:pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {yearEvents.map((event) => (
                  <div
                    key={event.id || event.title}
                    className="p-5 rounded-2xl bg-card border border-border/70 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(event.category)}
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {getCategoryBadge(event.category)}
                        </span>
                      </div>
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline shrink-0"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-foreground">
                      {event.link ? (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <span>{event.title}</span>
                        </a>
                      ) : (
                        event.title
                      )}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MyTimelineComponent;