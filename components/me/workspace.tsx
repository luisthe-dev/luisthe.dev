import React from "react";
import { Laptop, Terminal, Wrench, Layers, GitBranch, BookMarked } from "lucide-react";

interface WorkspaceSection {
  title: string;
  icon: React.ReactNode;
  items: { name: string; desc: string }[];
}

const SECTIONS: WorkspaceSection[] = [
  {
    title: "Daily Hardware",
    icon: <Laptop className="w-4 h-4 text-primary" />,
    items: [
      { name: "Apple MacBook Pro M3 Max", desc: "64GB Unified RAM, 1TB SSD" },
      { name: "LG UltraFine 4K 27-inch", desc: "Color-accurate external display" },
      { name: "Keychron Q1 Pro Mechanical", desc: "Custom tactile switches" },
      { name: "Logitech MX Master 3S", desc: "Ergonomic precision mouse" },
    ],
  },
  {
    title: "Daily Software",
    icon: <Terminal className="w-4 h-4 text-primary" />,
    items: [
      { name: "VS Code & Antigravity IDE", desc: "Custom minimal dark theme" },
      { name: "Ghostty / WezTerm", desc: "GPU-accelerated terminal" },
      { name: "Arc Browser", desc: "Workspaces and split browsing" },
      { name: "Docker & Podman", desc: "Local containerized services" },
    ],
  },
  {
    title: "Favorite Tools",
    icon: <Wrench className="w-4 h-4 text-primary" />,
    items: [
      { name: "Notion", desc: "Knowledge management & notes" },
      { name: "Linear", desc: "Streamlined issue tracking" },
      { name: "Figma", desc: "UI design & wireframing" },
      { name: "Raycast", desc: "Keyboard-driven macOS command launcher" },
    ],
  },
  {
    title: "Core Stack & Engineering",
    icon: <Layers className="w-4 h-4 text-primary" />,
    items: [
      { name: "Golang & PHP (Laravel)", desc: "High-throughput microservices & CBA integrations" },
      { name: "Node.js (NestJS, Express)", desc: "Scalable event-driven backends & APIs" },
      { name: "TypeScript & React / Next.js", desc: "Type-safe reactive web apps & design systems" },
      { name: "PostgreSQL & Redis", desc: "Distributed caching, Redlock & worker queues" },
    ],
  },
  {
    title: "Ventures & Ecosystem",
    icon: <GitBranch className="w-4 h-4 text-primary" />,
    items: [
      { name: "Luis Dev Limited (luisdev.ng)", desc: "Full-stack software engineering & tech consulting agency" },
      { name: "MyInvite (myinvite.ng)", desc: "High-throughput QR ticketing & event platform" },
      { name: "Agrobod (agrobod.ng)", desc: "Agritech supply chain transparency & direct delivery" },
      { name: "luisthe-dev (GitHub)", desc: "Open source contributions, utilities & tools" },
    ],
  },
  {
    title: "Systems & Architecture",
    icon: <BookMarked className="w-4 h-4 text-primary" />,
    items: [
      { name: "Fintech Systems Design", desc: "Automated reconciliation & vendor failover logic" },
      { name: "Designing Data-Intensive Applications", desc: "Martin Kleppmann (High-reliability systems)" },
      { name: "AI Automation & LLM Pipelines", desc: "Agentic systems & intelligent orchestration" },
    ],
  },
];

const MyWorkspaceComponent = () => {
  return (
    <section className="w-full py-12">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Uses / Workspace
        </h2>
        <p className="text-sm text-muted-foreground">
          A living directory of the hardware, software, and gear I rely on daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="p-6 rounded-2xl bg-card border border-border/70 shadow-2xs flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              {section.icon}
              <h3 className="font-bold text-sm text-foreground">
                {section.title}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {section.items.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <span className="font-semibold text-xs text-foreground">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyWorkspaceComponent;