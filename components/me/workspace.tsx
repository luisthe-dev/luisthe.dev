import React from "react";
import { WorkspaceItem } from "@/lib/types/blog";
import { Laptop, Terminal, Wrench, Cloud, ExternalLink } from "lucide-react";

interface MyWorkspaceComponentProps {
  items?: WorkspaceItem[];
}

export default function MyWorkspaceComponent({
  items = [],
}: MyWorkspaceComponentProps) {
  // Group by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  const getCategoryTitle = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "hardware":
        return "Daily Hardware & Setup";
      case "software":
        return "Software & Development Tooling";
      case "cloud_services":
      case "cloud":
        return "Cloud Infrastructure & Services";
      default:
        return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "hardware":
        return <Laptop className="w-4 h-4 text-primary" />;
      case "software":
        return <Terminal className="w-4 h-4 text-emerald-500" />;
      case "cloud_services":
      case "cloud":
        return <Cloud className="w-4 h-4 text-cyan-500" />;
      default:
        return <Wrench className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <section className="w-full pb-12 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Workspace, Setup &amp; Uses
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Hardware, operating software, and developer tools powering my daily engineering workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryItems = items.filter((i) => i.category === cat);
          return (
            <div
              key={cat}
              className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-4 shadow-2xs hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                {getCategoryIcon(cat)}
                <h3 className="font-bold text-sm text-foreground">
                  {getCategoryTitle(cat)}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-foreground">
                        {item.name}
                      </span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Learn more"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="col-span-full text-sm text-muted-foreground italic py-6">
            No workspace items configured.
          </div>
        )}
      </div>
    </section>
  );
}