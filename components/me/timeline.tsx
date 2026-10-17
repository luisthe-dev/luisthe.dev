"use client";

import React, { useState } from "react";
import { TimelineEvent } from "@/lib/types/blog";
import {
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react";

interface MyTimelineComponentProps {
  events?: TimelineEvent[];
}

const MyTimelineComponent: React.FC<MyTimelineComponentProps> = ({
  events = [],
}) => {
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { key: "all", label: "All Milestones" },
    { key: "experience", label: "Work Experience" },
    { key: "schooling", label: "Education & Degrees" },
    { key: "certification", label: "Certifications" },
  ];

  const filteredEvents = events.filter((e) => {
    if (filter === "all") return true;
    return e.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "schooling":
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case "certification":
        return <Award className="w-4 h-4 text-amber-500" />;
      case "experience":
      default:
        return <Briefcase className="w-4 h-4 text-primary" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "schooling":
        return "Education";
      case "certification":
        return "Certification";
      case "experience":
        return "Experience";
      default:
        return category;
    }
  };

  return (
    <section className="w-full border-b border-border/60 pb-12 flex flex-col gap-6">
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Experience &amp; Education
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track record of software engineering leadership, ventures, and academic foundations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border w-fit">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === cat.key
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Items List */}
      <div className="relative pl-6 sm:pl-8 border-l border-border/80 flex flex-col gap-8 mt-2">
        {filteredEvents.map((event) => (
          <div key={event.id} className="relative group flex flex-col gap-2">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-2xs group-hover:border-primary transition-colors">
              {getCategoryIcon(event.category)}
            </div>

            {/* Event Header */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {getCategoryBadge(event.category)}
              </span>

              {event.period && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{event.period}</span>
                </span>
              )}

              {event.location && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{event.location}</span>
                </span>
              )}
            </div>

            {/* Title & Organization */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {event.title}
                {event.organization && (
                  <span className="text-primary font-semibold ml-1.5">
                    @ {event.organization}
                  </span>
                )}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
              {event.description}
            </p>

            {/* Optional Link */}
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline w-fit pt-1"
              >
                <span>View platform</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-sm text-muted-foreground italic py-6">
            No milestones found for this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTimelineComponent;