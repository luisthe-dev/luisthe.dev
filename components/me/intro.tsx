import React from "react";
import { Sparkles, Calendar } from "lucide-react";
import FacelessCoderLottie from "@/components/ui/faceless-coder-lottie";
import { SiteSettingsMap } from "@/lib/types/blog";

interface MyIntroComponentProps {
  settings?: SiteSettingsMap;
}

const MyIntroComponent: React.FC<MyIntroComponentProps> = ({ settings }) => {
  const headline =
    settings?.about_headline ||
    "Architecting resilient systems, leading cross-functional squads, and scaling distributed platforms.";
  const bio =
    settings?.about_bio ||
    "Technical Product and Project Manager with 8+ years of cross-functional experience steering product strategy, technical architecture, and end-to-end execution across high-throughput fintech, edtech, e-commerce, and enterprise SaaS platforms. Proven track record bridging technical engineering depth with product discovery, PRD authoring, backlog prioritization, and iterative user-driven rollouts. Adept at orchestrating Agile squads to launch resilient microservices architectures, scale transactional engines to 50k+ active users, reduce API response times by 70%, and optimize operational throughput while aligning engineering velocity with measurable business KPIs.";

  return (
    <section className="w-full border-b border-border/60 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left Column: Bio Narrative */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-secondary-foreground w-fit">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Technical Product Manager &amp; Systems Architect</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Divine Adesiyan
          </h1>

          <p className="text-lg text-primary font-semibold">
            {headline}
          </p>

          <div className="prose prose-neutral dark:prose-invert text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4 pt-2">
            <p className="whitespace-pre-line leading-relaxed text-foreground/90">
              {bio}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={settings?.cal_link || "https://cal.com/luisthe-dev"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Call via Cal.com</span>
            </a>
          </div>
        </div>

        {/* Right Column: Faceless Developer Badge */}
        <div className="md:col-span-4 flex justify-center md:justify-end">
          <div className="w-full max-w-[240px] flex flex-col items-center gap-3">
            <FacelessCoderLottie size="lg" />
            <div className="text-center">
              <h3 className="font-bold text-sm text-foreground">Divine Adesiyan</h3>
              <p className="text-xs text-muted-foreground">LuisThe___Dev</p>
              <p className="text-[11px] text-muted-foreground/70">Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyIntroComponent;