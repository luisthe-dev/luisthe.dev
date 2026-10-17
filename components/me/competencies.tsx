import React from "react";
import { Competency } from "@/lib/types/blog";
import { Cpu, Server, Database, Cloud, Layout } from "lucide-react";

interface CompetenciesComponentProps {
  competencies?: Competency[];
}

export default function CompetenciesComponent({
  competencies = [],
}: CompetenciesComponentProps) {
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("backend")) return <Server className="w-4 h-4 text-primary" />;
    if (cat.includes("frontend") || cat.includes("mobile"))
      return <Layout className="w-4 h-4 text-emerald-500" />;
    if (cat.includes("database") || cat.includes("cache"))
      return <Database className="w-4 h-4 text-amber-500" />;
    if (cat.includes("cloud") || cat.includes("devops"))
      return <Cloud className="w-4 h-4 text-cyan-500" />;
    return <Cpu className="w-4 h-4 text-violet-500" />;
  };

  return (
    <section className="w-full border-b border-border/60 pb-12 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Core Competencies &amp; Technical Skills
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Specialized tech stack and architectural disciplines mastered over 8+ years of production experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competencies.map((comp) => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 shadow-2xs hover:border-border transition-colors"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              {getCategoryIcon(comp.category)}
              <h3 className="font-bold text-sm text-foreground">
                {comp.category}
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {comp.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
