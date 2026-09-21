import React from "react";
import Image from "next/image";
import { MapPin, Briefcase, Code2, Sparkles, GraduationCap, Mail } from "lucide-react";
import { LinkedinIcon, GithubIcon, TwitterIcon } from "@/components/ui/icons";

const MyIntroComponent = () => {
  return (
    <section className="w-full border-b border-border/60 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left Column: Bio Narrative */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-secondary-foreground w-fit">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Founder, Engineering Leader &amp; Architect</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Divine Adesiyan
          </h1>

          <div className="prose prose-neutral dark:prose-invert text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4 pt-2">
            <p>
              Engineering Leader and Full Stack Architect with <strong className="text-foreground font-semibold">8+ years of experience</strong> designing
              and shipping high-scale distributed systems across <strong className="text-foreground font-semibold">fintech, event ticketing, legal tech, agritech, and enterprise commerce</strong>.
            </p>
            <p>
              I am the <strong className="text-foreground font-semibold">Main Founder &amp; Director of Luis Dev Limited</strong> (since Feb 2026),
              a premier Nigerian software engineering and technology consulting agency building full-stack products, enterprise platforms, and AI automation;
              and <strong className="text-foreground font-semibold">Co-founder at MyInvite</strong> (since April 2026), an event management and ticketing platform
              engineered for high-throughput QR check-ins and compliant payment gateways.
            </p>
            <p>
              Concurrently, I serve as <strong className="text-foreground font-semibold">Senior Backend Engineer at Konga Online Shopping</strong>,
              optimizing core financial microservices in <strong className="text-foreground font-semibold">Golang, PHP (Laravel), Express.js, and NestJS</strong>,
              delivering 50% throughput gains using Redis caching and background worker queues under 99.9% uptime SLAs.
            </p>
            <p>
              I hold a <strong className="text-foreground font-semibold">B.Sc. (B.Ed.) in Computer Science &amp; Education from the University of Ilorin</strong> and
              actively mentor engineering cohorts while publishing architecture deep-dives.
            </p>
          </div>
        </div>

        {/* Right Column: Quick Facts Card */}
        <div className="md:col-span-5">
          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border">
                <Image
                  src="/avatar.jpg"
                  alt="Divine Adesiyan"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Divine Adesiyan</h3>
                <p className="text-xs text-muted-foreground">LuisThe___Dev</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-foreground block">Current Roles</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground font-medium">Founder &amp; Director</strong> @ Luis Dev Limited
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground font-medium">Co-founder</strong> @ MyInvite
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground font-medium">Senior Backend Engineer</strong> @ Konga
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Location &amp; Availability</span>
                  <span className="text-muted-foreground">Nigeria (Open to Worldwide Remote)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Education</span>
                  <span className="text-muted-foreground">
                    B.Sc. (B.Ed.) Computer Science &amp; Education, University of Ilorin
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Email</span>
                  <a
                    href="mailto:divinegiftadesiyan@gmail.com"
                    className="text-primary hover:underline"
                  >
                    divinegiftadesiyan@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LinkedinIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">LinkedIn</span>
                  <a
                    href="https://linkedin.com/in/divinegiftadesiyan"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-mono text-[11px]"
                  >
                    linkedin.com/in/divinegiftadesiyan
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Code2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Core Competencies</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {[
                      "Golang",
                      "PHP (Laravel)",
                      "Node.js",
                      "React JS",
                      "React Native",
                      "TypeScript",
                      "Next.js",
                      "PostgreSQL",
                      "Redis",
                      "Docker",
                      "AWS",
                      "Azure",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-mono text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyIntroComponent;