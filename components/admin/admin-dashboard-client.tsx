"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Loader2,
  UserCheck,
  Share2,
  PenTool,
  Mail,
  Server,
  Lock,
  Plus,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Eye,
  Send,
  Radio,
  Sparkles,
} from "lucide-react";
import {
  BlogPost,
  TimelineEvent,
  Competency,
  WorkspaceItem,
  SocialLink,
  SiteSettingsMap,
  NewsletterSubscriber,
} from "@/lib/types/blog";
import { toast } from "@/components/ui/toast";
import Modal from "@/components/ui/modal";
import ConfirmModal from "@/components/ui/confirm-modal";
import ArticleBody from "@/components/blog/article-body";

interface AdminDashboardClientProps {
  initialPosts: BlogPost[];
  initialTimelineEvents: TimelineEvent[];
  initialCompetencies: Competency[];
  initialWorkspaceItems: WorkspaceItem[];
  initialSocialLinks: SocialLink[];
  initialSettings: SiteSettingsMap;
  initialSubscribers: NewsletterSubscriber[];
}

export default function AdminDashboardClient({
  initialPosts,
  initialTimelineEvents,
  initialCompetencies,
  initialWorkspaceItems,
  initialSocialLinks,
  initialSettings,
  initialSubscribers,
}: AdminDashboardClientProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    | "articles"
    | "resume"
    | "socials"
    | "copy"
    | "newsletter"
    | "broadcast"
    | "smtp"
    | "security"
  >("articles");

  // Sub-tabs for resume
  const [resumeSubTab, setResumeSubTab] = useState<
    "experience" | "schooling" | "competencies" | "workspace"
  >("experience");

  // State
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(initialTimelineEvents);
  const [competencies, setCompetencies] =
    useState<Competency[]>(initialCompetencies);
  const [workspaceItems, setWorkspaceItems] =
    useState<WorkspaceItem[]>(initialWorkspaceItems);
  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>(initialSocialLinks);
  const [siteSettings, setSiteSettings] =
    useState<SiteSettingsMap>(initialSettings);
  const [subscribers, setSubscribers] =
    useState<NewsletterSubscriber[]>(initialSubscribers);

  // Filter/Search for posts
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Feedback messages
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // SMTP Testing state
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpResult, setSmtpResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Broadcast space state
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastPreviewText, setBroadcastPreviewText] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastTestEmail, setBroadcastTestEmail] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastPreviewMode, setBroadcastPreviewMode] = useState<"edit" | "preview">("edit");

  const loadBroadcastTemplate = (type: "announcement" | "digest" | "thoughts") => {
    if (type === "announcement") {
      setBroadcastSubject("Project Spotlight: High-Throughput Event Streaming Architecture");
      setBroadcastPreviewText("A breakdown of what we built and how we scaled to 10k req/sec.");
      setBroadcastBody(
`Hello friends,

I wanted to share a deep architectural overview of a high-throughput event processor I recently designed and deployed.

### Core Architecture Highlights
- **Decoupled Ingestion**: Zero-loss buffering using persistent queues.
- **Microservices Engine**: Sub-millisecond latency Go services with Postgres & Redis caching.
- **Failover Redundancy**: Distributed locking and automatic state recovery.

Read the complete breakdown on the blog:
[Read Article](https://luisthe.dev/blog)

Best regards,  
**Divine Adesiyan**  
*Technical Product Manager & Systems Architect*`
      );
    } else if (type === "digest") {
      setBroadcastSubject("High Contrast Digest #12: Engineering Leadership & System Design");
      setBroadcastPreviewText("Reflections on tech debt, engineering velocity, and distributed systems.");
      setBroadcastBody(
`Welcome to this week's edition of High Contrast.

Here are the key engineering principles and architectural takeaways from the past two weeks:

1. **Velocity vs. Robustness**: Why early modular boundaries pay 10x dividends when scaling.
2. **Database Performance**: Query tuning patterns in high-concurrency transactional workflows.
3. **Product Engineering**: How to align backend metrics with real customer value.

Check out the latest writings on [luisthe.dev/blog](https://luisthe.dev/blog).

Until next time,  
**Divine Adesiyan**`
      );
    } else {
      setBroadcastSubject("Reflections: What I Learned Building My Portfolio & Architecture Hub");
      setBroadcastPreviewText("Lessons on modern Next.js 16, Turbopack, and headless CMS architectures.");
      setBroadcastBody(
`Hey everyone,

Taking a quick moment to reflect on recent learnings in full-stack architecture, database design with Neon PostgreSQL & Prisma, and performance optimization.

Keep building,  
**Divine**`
      );
    }
  };

  const handleSendTestBroadcast = async () => {
    if (!broadcastSubject.trim()) {
      toast.warning("Please provide a broadcast subject line");
      return;
    }
    if (!broadcastBody.trim()) {
      toast.warning("Please write your broadcast message body");
      return;
    }
    if (!broadcastTestEmail.trim() || !broadcastTestEmail.includes("@")) {
      toast.warning("Please enter a valid test recipient email address");
      return;
    }

    setBroadcastSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: broadcastSubject.trim(),
          body: broadcastBody.trim(),
          previewText: broadcastPreviewText.trim(),
          testEmailOnly: broadcastTestEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test broadcast");

      toast.success(data.message || `Test email sent to ${broadcastTestEmail}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch test";
      toast.error(msg);
    } finally {
      setBroadcastSending(false);
    }
  };

  const handleSendBroadcastToAll = () => {
    if (!broadcastSubject.trim()) {
      toast.warning("Please provide a broadcast subject line");
      return;
    }
    if (!broadcastBody.trim()) {
      toast.warning("Please write your broadcast message body");
      return;
    }
    if (subscribers.length === 0) {
      toast.warning("There are no registered newsletter subscribers to receive this broadcast.");
      return;
    }

    askConfirm({
      title: "Dispatch Newsletter Broadcast",
      message: `Are you sure you want to send this broadcast to all ${subscribers.length} registered subscriber${subscribers.length === 1 ? "" : "s"}? This action immediately dispatches emails.`,
      confirmText: `Send to ${subscribers.length} Subscribers`,
      variant: "warning",
      onConfirm: async () => {
        setBroadcastSending(true);
        try {
          const res = await fetch("/api/admin/broadcast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: broadcastSubject.trim(),
              body: broadcastBody.trim(),
              previewText: broadcastPreviewText.trim(),
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to send broadcast");

          toast.success(data.message || "Broadcast successfully sent to subscribers!");
          setBroadcastSubject("");
          setBroadcastPreviewText("");
          setBroadcastBody("");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to dispatch broadcast";
          toast.error(msg);
        } finally {
          setBroadcastSending(false);
        }
      },
    });
  };

  // Custom Confirm Dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning";
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Delete",
    variant: "danger",
    onConfirm: () => {},
  });

  const askConfirm = (opts: {
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning";
    onConfirm: () => Promise<void> | void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: opts.title,
      message: opts.message,
      confirmText: opts.confirmText || "Delete",
      variant: opts.variant || "danger",
      onConfirm: opts.onConfirm,
    });
  };

  // Timeline Modal state
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineSubmitting, setTimelineSubmitting] = useState(false);
  const [timelineForm, setTimelineForm] = useState<{
    category: "experience" | "schooling";
    title: string;
    organization: string;
    period: string;
    year: number;
    description: string;
  }>({
    category: "experience",
    title: "",
    organization: "",
    period: "2024 — Present",
    year: new Date().getFullYear(),
    description: "",
  });

  const openAddTimeline = (category: "experience" | "schooling") => {
    setTimelineForm({
      category,
      title: "",
      organization: "",
      period: category === "experience" ? "2024 — Present" : "2020 — 2024",
      year: new Date().getFullYear(),
      description: "",
    });
    setTimelineModalOpen(true);
  };

  const submitTimelineForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineForm.title.trim()) {
      toast.warning("Please enter a title or role");
      return;
    }
    if (!timelineForm.organization.trim()) {
      toast.warning("Please enter an organization or institution");
      return;
    }
    setTimelineSubmitting(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...timelineForm,
          order: timelineEvents.length + 1,
        }),
      });
      if (!res.ok) throw new Error("Failed to add milestone");
      const created = await res.json();
      setTimelineEvents((prev) => [created, ...prev]);
      setTimelineModalOpen(false);
      toast.success(
        timelineForm.category === "experience"
          ? "Experience role added successfully!"
          : "Education milestone added successfully!"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create milestone";
      toast.error(msg);
    } finally {
      setTimelineSubmitting(false);
    }
  };

  // Competency Modal state
  const [competencyModalOpen, setCompetencyModalOpen] = useState(false);
  const [competencySubmitting, setCompetencySubmitting] = useState(false);
  const [competencyForm, setCompetencyForm] = useState({
    category: "",
    skills: "",
  });

  const openAddCompetency = () => {
    setCompetencyForm({ category: "", skills: "" });
    setCompetencyModalOpen(true);
  };

  const submitCompetencyForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competencyForm.category.trim()) {
      toast.warning("Please enter a category name");
      return;
    }
    const skillsArr = competencyForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillsArr.length === 0) {
      toast.warning("Please enter at least one comma-separated skill");
      return;
    }
    setCompetencySubmitting(true);
    try {
      const res = await fetch("/api/admin/competencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: competencyForm.category,
          skills: skillsArr,
          order: competencies.length + 1,
        }),
      });
      if (!res.ok) throw new Error("Failed to add competency");
      const created = await res.json();
      setCompetencies((prev) => [...prev, created]);
      setCompetencyModalOpen(false);
      toast.success("Competency category added successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create";
      toast.error(msg);
    } finally {
      setCompetencySubmitting(false);
    }
  };

  // Workspace Modal state
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceSubmitting, setWorkspaceSubmitting] = useState(false);
  const [workspaceForm, setWorkspaceForm] = useState({
    name: "",
    category: "hardware",
    description: "",
  });

  const openAddWorkspace = () => {
    setWorkspaceForm({ name: "", category: "hardware", description: "" });
    setWorkspaceModalOpen(true);
  };

  const submitWorkspaceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceForm.name.trim()) {
      toast.warning("Please enter a tool or hardware name");
      return;
    }
    setWorkspaceSubmitting(true);
    try {
      const res = await fetch("/api/admin/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...workspaceForm,
          order: workspaceItems.length + 1,
        }),
      });
      if (!res.ok) throw new Error("Failed to add workspace item");
      const created = await res.json();
      setWorkspaceItems((prev) => [...prev, created]);
      setWorkspaceModalOpen(false);
      toast.success("Workspace item added successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add";
      toast.error(msg);
    } finally {
      setWorkspaceSubmitting(false);
    }
  };

  // Social Modal state
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);
  const [socialForm, setSocialForm] = useState({
    platform: "github",
    label: "",
    url: "",
  });

  const openAddSocial = () => {
    setSocialForm({ platform: "github", label: "", url: "" });
    setSocialModalOpen(true);
  };

  const submitSocialForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialForm.label.trim()) {
      toast.warning("Please enter a label for this link");
      return;
    }
    if (!socialForm.url.trim()) {
      toast.warning("Please enter the full profile URL");
      return;
    }
    setSocialSubmitting(true);
    try {
      const res = await fetch("/api/admin/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: socialForm.platform.toLowerCase(),
          label: socialForm.label,
          url: socialForm.url,
          order: socialLinks.length + 1,
          isEnabled: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to add social link");
      const created = await res.json();
      setSocialLinks((prev) => [...prev, created]);
      setSocialModalOpen(false);
      toast.success("Social link added successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add";
      toast.error(msg);
    } finally {
      setSocialSubmitting(false);
    }
  };

  // Post Deletion
  const handleDeletePost = (id: string, title: string) => {
    askConfirm({
      title: "Delete Article",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: "Delete Article",
      onConfirm: async () => {
        setDeletingId(id);
        try {
          const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete post");
          setPosts((prev) => prev.filter((p) => p.id !== id));
          toast.success(`Deleted "${title}"`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to delete post";
          toast.error(msg);
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  // Site Copy Save
  const handleSaveCopy = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      const successText = "Landing & About copy saved successfully!";
      setSaveMessage({ text: successText, type: "success" });
      toast.success(successText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save settings";
      setSaveMessage({ text: msg, type: "error" });
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // SMTP Save
  const handleSaveSmtp = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtp_host: siteSettings.smtp_host,
          smtp_port: siteSettings.smtp_port,
          smtp_user: siteSettings.smtp_user,
          smtp_pass: siteSettings.smtp_pass,
          smtp_from: siteSettings.smtp_from,
          smtp_secure: siteSettings.smtp_secure,
        }),
      });
      if (!res.ok) throw new Error("Failed to save SMTP configuration");
      const successText = "SMTP configuration saved successfully!";
      setSaveMessage({ text: successText, type: "success" });
      toast.success(successText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save SMTP settings";
      setSaveMessage({ text: msg, type: "error" });
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Test SMTP
  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    setSmtpResult(null);
    try {
      const res = await fetch("/api/admin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtp_host: siteSettings.smtp_host,
          smtp_port: siteSettings.smtp_port,
          smtp_user: siteSettings.smtp_user,
          smtp_pass: siteSettings.smtp_pass,
          smtp_secure: siteSettings.smtp_secure,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Connection test failed");
      }
      setSmtpResult({ success: true, message: data.message });
      toast.success(data.message || "SMTP connection verified!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      setSmtpResult({ success: false, message: msg });
      toast.error(msg);
    } finally {
      setSmtpTesting(false);
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match!");
      return;
    }
    setPasswordLoading(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      const successText = "Admin password updated successfully in the database!";
      setSaveMessage({
        text: successText,
        type: "success",
      });
      toast.success(successText);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password";
      setSaveMessage({ text: msg, type: "error" });
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Timeline Event Deletion
  const handleDeleteTimeline = (id: string, title?: string) => {
    askConfirm({
      title: "Remove Milestone",
      message: title
        ? `Are you sure you want to remove "${title}" from your timeline?`
        : "Are you sure you want to remove this milestone?",
      confirmText: "Remove Milestone",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/timeline?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete milestone");
          setTimelineEvents((prev) => prev.filter((e) => e.id !== id));
          toast.success("Milestone removed successfully");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to delete";
          toast.error(msg);
        }
      },
    });
  };

  // Competency Deletion
  const handleDeleteCompetency = (id: string, category?: string) => {
    askConfirm({
      title: "Remove Competency Group",
      message: category
        ? `Are you sure you want to remove the "${category}" competency category?`
        : "Are you sure you want to remove this competency group?",
      confirmText: "Remove Group",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/competencies?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete competency");
          setCompetencies((prev) => prev.filter((c) => c.id !== id));
          toast.success("Competency category removed");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to delete";
          toast.error(msg);
        }
      },
    });
  };

  // Workspace Item Deletion
  const handleDeleteWorkspace = (id: string, name?: string) => {
    askConfirm({
      title: "Delete Workspace Tool",
      message: name
        ? `Are you sure you want to remove "${name}" from your workspace?`
        : "Are you sure you want to delete this workspace item?",
      confirmText: "Delete Item",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/workspace?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete item");
          setWorkspaceItems((prev) => prev.filter((w) => w.id !== id));
          toast.success("Workspace item removed");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to delete";
          toast.error(msg);
        }
      },
    });
  };

  // Social Links Management
  const handleToggleSocial = async (link: SocialLink) => {
    try {
      const updated = await fetch("/api/admin/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: link.id,
          isEnabled: !link.isEnabled,
        }),
      }).then((r) => r.json());

      setSocialLinks((prev) =>
        prev.map((s) => (s.id === link.id ? { ...s, isEnabled: updated.isEnabled } : s))
      );
      toast.info(`${link.label} is now ${updated.isEnabled ? "enabled" : "disabled"}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle";
      toast.error(msg);
    }
  };

  const handleDeleteSocial = (id: string, label?: string) => {
    askConfirm({
      title: "Delete Social Link",
      message: label
        ? `Are you sure you want to delete "${label}"?`
        : "Are you sure you want to delete this social link?",
      confirmText: "Delete Link",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/socials?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete social link");
          setSocialLinks((prev) => prev.filter((s) => s.id !== id));
          toast.success("Social link removed");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to delete";
          toast.error(msg);
        }
      },
    });
  };

  // Subscriber Deletion
  const handleDeleteSubscriber = (id: string, email: string) => {
    askConfirm({
      title: "Remove Newsletter Subscriber",
      message: `Are you sure you want to remove ${email} from the newsletter distribution list?`,
      confirmText: "Remove Subscriber",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/subscribers?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete subscriber");
          setSubscribers((prev) => prev.filter((s) => s.id !== id));
          toast.success("Subscriber removed successfully");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to delete";
          toast.error(msg);
        }
      },
    });
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Admin Studio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your articles, resume milestones, competencies, landing copy, newsletter, and system settings.
          </p>
        </div>

        {/* Global Save Feedback Alert */}
        {saveMessage && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              saveMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
            }`}
          >
            {saveMessage.type === "success" ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        )}
      </div>

      {/* Main Studio Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border w-fit">
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "articles"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Articles ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("resume")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "resume"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>About &amp; Resume</span>
        </button>

        <button
          onClick={() => setActiveTab("socials")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "socials"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social Links ({socialLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("copy")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "copy"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Landing Copy</span>
        </button>

        <button
          onClick={() => setActiveTab("newsletter")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "newsletter"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Newsletter ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("broadcast")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "broadcast"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Broadcast Space</span>
        </button>

        <button
          onClick={() => setActiveTab("smtp")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "smtp"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>SMTP Setup</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security &amp; Pass</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. ARTICLES TAB */}
      {/* ========================================================= */}
      {activeTab === "articles" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {posts.filter((p) => p.status === "published").length} Published
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-semibold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {posts.filter((p) => p.status === "draft").length} Drafts
                </span>
              </div>
            </div>

            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs cursor-pointer w-fit"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Article (Markdown Supported)</span>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles by title, category, slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border shrink-0">
              {(["all", "published", "draft"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    statusFilter === filter
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-accent/30 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                            <Image
                              src={post.coverImage || "/24.jpg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {post.title}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              /{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-semibold">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            post.status === "published"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              post.status === "published"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span className="capitalize">{post.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === "published" && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              title="View Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            title="Edit Article"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
                            title="Delete Article"
                          >
                            {deletingId === post.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No articles match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ABOUT & RESUME TAB */}
      {/* ========================================================= */}
      {activeTab === "resume" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div className="flex items-center gap-1.5">
              {(
                [
                  ["experience", "Work Experience"],
                  ["schooling", "Education & Degrees"],
                  ["competencies", "Competencies & Skills"],
                  ["workspace", "Workspace & Tools"],
                ] as const
              ).map(([subKey, subLabel]) => (
                <button
                  key={subKey}
                  onClick={() => setResumeSubTab(subKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    resumeSubTab === subKey
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground bg-card border border-border"
                  }`}
                >
                  {subLabel}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div>
              {resumeSubTab === "experience" && (
                <button
                  onClick={() => openAddTimeline("experience")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role / Experience</span>
                </button>
              )}
              {resumeSubTab === "schooling" && (
                <button
                  onClick={() => openAddTimeline("schooling")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree / Institution</span>
                </button>
              )}
              {resumeSubTab === "competencies" && (
                <button
                  onClick={openAddCompetency}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Competency Group</span>
                </button>
              )}
              {resumeSubTab === "workspace" && (
                <button
                  onClick={openAddWorkspace}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Workspace Tool</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-tab: Experience or Schooling */}
          {(resumeSubTab === "experience" || resumeSubTab === "schooling") && (
            <div className="grid grid-cols-1 gap-4">
              {timelineEvents
                .filter((e) => e.category === resumeSubTab)
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-5 rounded-2xl bg-card border border-border flex items-start justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {event.title}
                        </span>
                        {event.organization && (
                          <span className="text-xs text-primary font-semibold">
                            @ {event.organization}
                          </span>
                        )}
                        {event.period && (
                          <span className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                            {event.period}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {event.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteTimeline(event.id, event.title)}
                      className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Sub-tab: Competencies */}
          {resumeSubTab === "competencies" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competencies.map((comp) => (
                <div
                  key={comp.id}
                  className="p-5 rounded-2xl bg-card border border-border flex flex-col gap-3 shadow-2xs justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <h3 className="font-bold text-sm text-foreground">
                        {comp.category}
                      </h3>
                      <button
                        onClick={() => handleDeleteCompetency(comp.id, comp.category)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete Group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3">
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
                </div>
              ))}
            </div>
          )}

          {/* Sub-tab: Workspace */}
          {resumeSubTab === "workspace" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaceItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-card border border-border flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-wider text-primary font-bold">
                      {item.category}
                    </span>
                    <span className="font-bold text-xs text-foreground">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteWorkspace(item.id, item.name)}
                    className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SOCIAL LINKS TAB */}
      {/* ========================================================= */}
      {activeTab === "socials" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Social profile links displayed across Header, Hero, Outro, and Footer.
            </p>
            <button
              onClick={openAddSocial}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Social Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center font-bold text-xs capitalize text-secondary-foreground">
                    {link.platform.slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-foreground">
                      {link.label}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline truncate max-w-[200px]"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSocial(link)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      link.isEnabled
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {link.isEnabled ? "Enabled" : "Disabled"}
                  </button>
                  <button
                    onClick={() => handleDeleteSocial(link.id, link.label)}
                    className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. LANDING PAGE COPY TAB */}
      {/* ========================================================= */}
      {activeTab === "copy" && (
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col gap-5 shadow-xs">
            <h2 className="text-base font-bold text-foreground">
              Hero &amp; About Copy Settings
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Hero Headline / Name
                </label>
                <input
                  type="text"
                  value={siteSettings.hero_headline || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      hero_headline: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Hero Top Badge Text
                </label>
                <input
                  type="text"
                  value={siteSettings.hero_badge_text || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      hero_badge_text: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Hero Subheadline / Role Tagline
                </label>
                <input
                  type="text"
                  value={siteSettings.hero_subheadline || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      hero_subheadline: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Hero Biography Description
                </label>
                <textarea
                  rows={4}
                  value={siteSettings.hero_bio || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      hero_bio: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <label className="text-xs font-semibold text-foreground">
                  About Page Subheading
                </label>
                <input
                  type="text"
                  value={siteSettings.about_headline || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      about_headline: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  About Page Full Bio Narrative
                </label>
                <textarea
                  rows={6}
                  value={siteSettings.about_bio || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      about_bio: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveCopy}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer disabled:opacity-60 shadow-xs"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save All Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. NEWSLETTER TAB */}
      {/* ========================================================= */}
      {activeTab === "newsletter" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Registered Subscribers
              </h2>
              <p className="text-xs text-muted-foreground">
                Readers who opted into email notifications and technical writing broadcasts.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-bold">
              Total: {subscribers.length}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Subscribed Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground italic">
                      No subscribers registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5B. BROADCAST SPACE TAB */}
      {/* ========================================================= */}
      {activeTab === "broadcast" && (
        <div className="flex flex-col gap-6 max-w-4xl">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Radio className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  Newsletter Broadcast Space
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Compose custom markdown announcements, technical digests, and engineering reflections to dispatch to your audience.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Mail className="w-3.5 h-3.5" />
                <span>{subscribers.length} Active {subscribers.length === 1 ? "Subscriber" : "Subscribers"}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  siteSettings.smtp_host && siteSettings.smtp_user
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>
                  {siteSettings.smtp_host && siteSettings.smtp_user
                    ? "SMTP Ready"
                    : "SMTP Not Configured"}
                </span>
              </span>
            </div>
          </div>

          {/* Quick Starter Templates */}
          <div className="p-5 rounded-3xl bg-card/60 border border-border/80 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Quick Starter Templates</span>
              </span>
              <span className="text-[11px] text-muted-foreground">Click to load starter outline</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => loadBroadcastTemplate("announcement")}
                className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground hover:border-primary transition-all cursor-pointer"
              >
                🚀 Architecture Spotlight
              </button>
              <button
                type="button"
                onClick={() => loadBroadcastTemplate("digest")}
                className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground hover:border-primary transition-all cursor-pointer"
              >
                📰 High Contrast Digest
              </button>
              <button
                type="button"
                onClick={() => loadBroadcastTemplate("thoughts")}
                className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground hover:border-primary transition-all cursor-pointer"
              >
                💡 Engineering Reflections
              </button>
            </div>
          </div>

          {/* Broadcast Composer Form */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col gap-5 shadow-xs">
            {/* Subject and Preheader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Email Subject Line <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scaling Distributed State: Lessons from High-Throughput Pipelines"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Inbox Preview Snippet (Preheader)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A deep architectural breakdown of zero-loss event streaming and caching strategies."
                  value={broadcastPreviewText}
                  onChange={(e) => setBroadcastPreviewText(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
                <span className="text-[11px] text-muted-foreground">
                  Visible in Gmail/Apple Mail preview lists before the reader opens the email.
                </span>
              </div>
            </div>

            {/* Content Mode Toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Broadcast Message Body (Markdown) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setBroadcastPreviewMode("edit")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      broadcastPreviewMode === "edit"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastPreviewMode("preview")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      broadcastPreviewMode === "preview"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {broadcastPreviewMode === "edit" ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    rows={14}
                    placeholder="Write your email announcement in Markdown... (headings, bold, bullet points, links, code blocks are all supported)"
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-xs sm:text-sm font-mono leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                    <span>Supports Markdown formatting (# Heading, **bold**, - list item, [link](url))</span>
                    <span>{broadcastBody.length} characters</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border p-6 bg-background/50 overflow-y-auto max-h-[500px]">
                  <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="border-b border-border pb-4 mb-4">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Email Preview Mockup
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-1">
                        {broadcastSubject || "Untitled Broadcast"}
                      </h3>
                      {broadcastPreviewText && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Snippet: {broadcastPreviewText}
                        </p>
                      )}
                    </div>
                    {broadcastBody ? (
                      <ArticleBody content={broadcastBody} />
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center py-8">
                        No content written yet. Switch back to &quot;Write&quot; mode to compose your message.
                      </p>
                    )}
                    <div className="border-t border-border mt-8 pt-4 text-[11px] text-muted-foreground text-center">
                      Delivered by luisthe.dev | High Contrast Developer Portfolio
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Test & Live Dispatch Section */}
            <div className="border-t border-border pt-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-semibold text-foreground">
                    Send Single Test Email
                  </label>
                  <input
                    type="email"
                    placeholder="your-personal-email@example.com"
                    value={broadcastTestEmail}
                    onChange={(e) => setBroadcastTestEmail(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendTestBroadcast}
                  disabled={broadcastSending || !broadcastSubject.trim() || !broadcastBody.trim()}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {broadcastSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-primary" />
                      <span>Send Test Email</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Sending will dispatch emails to all <strong>{subscribers.length}</strong> active newsletter subscriber{subscribers.length === 1 ? "" : "s"}.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSendBroadcastToAll}
                  disabled={broadcastSending || subscribers.length === 0 || !broadcastSubject.trim() || !broadcastBody.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {broadcastSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching Broadcast...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      <span>Dispatch to All Subscribers ({subscribers.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. SMTP SETUP TAB */}
      {/* ========================================================= */}
      {activeTab === "smtp" && (
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col gap-5 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-foreground">
                SMTP Mail Server Configuration
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set up your SMTP host and test real-time connectivity to send newsletters and transactional notices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  SMTP Host (e.g. smtp.gmail.com or mail.resend.com)
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={siteSettings.smtp_host || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      smtp_host: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  SMTP Port
                </label>
                <input
                  type="text"
                  placeholder="587 or 465"
                  value={siteSettings.smtp_port || "587"}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      smtp_port: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  From Address
                </label>
                <input
                  type="text"
                  placeholder="Divine Adesiyan <hello@luisthe.dev>"
                  value={siteSettings.smtp_from || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      smtp_from: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  SMTP Username / Email
                </label>
                <input
                  type="text"
                  placeholder="your-email@gmail.com"
                  value={siteSettings.smtp_user || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      smtp_user: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  SMTP Password / App Secret
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={siteSettings.smtp_pass || ""}
                  onChange={(e) =>
                    setSiteSettings((prev) => ({
                      ...prev,
                      smtp_pass: e.target.value,
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Test result banner */}
            {smtpResult && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  smtpResult.success
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                }`}
              >
                {smtpResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{smtpResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestSmtp}
                disabled={smtpTesting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer disabled:opacity-60"
              >
                {smtpTesting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Test Connection Live</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSmtp}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer disabled:opacity-60 shadow-xs"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save SMTP Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. SECURITY & PASSWORD TAB */}
      {/* ========================================================= */}
      {activeTab === "security" && (
        <div className="flex flex-col gap-6 max-w-md">
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col gap-5 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Database Admin Password
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your admin passcode. Passwords are securely hashed with bcrypt in PostgreSQL.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  required
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  required
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password..."
                  required
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs mt-2"
              >
                {passwordLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>Update Admin Password</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Custom Confirmation Modal */}
      {/* ========================================================= */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />

      {/* ========================================================= */}
      {/* Custom Modal: Add Milestone (Experience / Schooling) */}
      {/* ========================================================= */}
      <Modal
        isOpen={timelineModalOpen}
        onClose={() => setTimelineModalOpen(false)}
        title={
          timelineForm.category === "experience"
            ? "Add Role & Experience"
            : "Add Education Milestone"
        }
        description="This milestone will immediately update your public About page."
        maxWidth="lg"
      >
        <form onSubmit={submitTimelineForm} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                {timelineForm.category === "experience"
                  ? "Job Title / Role"
                  : "Degree / Program"}
              </label>
              <input
                type="text"
                value={timelineForm.title}
                onChange={(e) =>
                  setTimelineForm({ ...timelineForm, title: e.target.value })
                }
                placeholder={
                  timelineForm.category === "experience"
                    ? "e.g. Senior Backend Engineer"
                    : "e.g. B.Sc. Computer Science"
                }
                required
                className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                {timelineForm.category === "experience"
                  ? "Company / Organization"
                  : "University / Institution"}
              </label>
              <input
                type="text"
                value={timelineForm.organization}
                onChange={(e) =>
                  setTimelineForm({
                    ...timelineForm,
                    organization: e.target.value,
                  })
                }
                placeholder={
                  timelineForm.category === "experience"
                    ? "e.g. Luis Dev Limited"
                    : "e.g. University of Lagos"
                }
                required
                className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Display Period
              </label>
              <input
                type="text"
                value={timelineForm.period}
                onChange={(e) =>
                  setTimelineForm({ ...timelineForm, period: e.target.value })
                }
                placeholder="e.g. 2024 — Present"
                required
                className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Year
              </label>
              <input
                type="number"
                value={timelineForm.year}
                onChange={(e) =>
                  setTimelineForm({
                    ...timelineForm,
                    year: parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Brief Description &amp; Accomplishments
            </label>
            <textarea
              rows={3}
              value={timelineForm.description}
              onChange={(e) =>
                setTimelineForm({
                  ...timelineForm,
                  description: e.target.value,
                })
              }
              placeholder="Outline high-throughput architectures built, teams managed, or major engineering milestones..."
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => setTimelineModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={timelineSubmitting}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {timelineSubmitting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Save Milestone</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* Custom Modal: Add Competency Group */}
      {/* ========================================================= */}
      <Modal
        isOpen={competencyModalOpen}
        onClose={() => setCompetencyModalOpen(false)}
        title="Add Competency Group"
        description="Add a technical capability domain with comma-separated skills."
        maxWidth="md"
      >
        <form onSubmit={submitCompetencyForm} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Category Title
            </label>
            <input
              type="text"
              value={competencyForm.category}
              onChange={(e) =>
                setCompetencyForm({
                  ...competencyForm,
                  category: e.target.value,
                })
              }
              placeholder="e.g. Distributed Systems & Storage"
              required
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Skills (Comma-separated)
            </label>
            <textarea
              rows={3}
              value={competencyForm.skills}
              onChange={(e) =>
                setCompetencyForm({
                  ...competencyForm,
                  skills: e.target.value,
                })
              }
              placeholder="e.g. Go, Kafka, Redis, PostgreSQL, Distributed Locks, Kubernetes"
              required
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => setCompetencyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={competencySubmitting}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {competencySubmitting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Add Competency Group</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* Custom Modal: Add Workspace Item */}
      {/* ========================================================= */}
      <Modal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        title="Add Workspace & Uses Item"
        description="Share workstation hardware, devtools, or services you use daily."
        maxWidth="md"
      >
        <form onSubmit={submitWorkspaceForm} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Item Name
            </label>
            <input
              type="text"
              value={workspaceForm.name}
              onChange={(e) =>
                setWorkspaceForm({ ...workspaceForm, name: e.target.value })
              }
              placeholder="e.g. MacBook Pro M3 Max"
              required
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Category
            </label>
            <select
              value={workspaceForm.category}
              onChange={(e) =>
                setWorkspaceForm({
                  ...workspaceForm,
                  category: e.target.value,
                })
              }
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software & Dev Tools</option>
              <option value="terminal">Terminal & Editor</option>
              <option value="desk">Desk & Audio</option>
              <option value="cloud_services">Cloud & Infrastructure</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Short Description / Specs
            </label>
            <textarea
              rows={2}
              value={workspaceForm.description}
              onChange={(e) =>
                setWorkspaceForm({
                  ...workspaceForm,
                  description: e.target.value,
                })
              }
              placeholder="e.g. 64GB Unified RAM, 1TB SSD, Space Black finish."
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => setWorkspaceModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={workspaceSubmitting}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {workspaceSubmitting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Add Workspace Item</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* Custom Modal: Add Social Link */}
      {/* ========================================================= */}
      <Modal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        title="Add Social Profile Link"
        description="Display your profile across the site header, hero, and footer."
        maxWidth="md"
      >
        <form onSubmit={submitSocialForm} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Platform
            </label>
            <select
              value={socialForm.platform}
              onChange={(e) =>
                setSocialForm({ ...socialForm, platform: e.target.value })
              }
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X / Twitter</option>
              <option value="substack">Substack</option>
              <option value="youtube">YouTube</option>
              <option value="email">Email / Mailto</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Display Label
            </label>
            <input
              type="text"
              value={socialForm.label}
              onChange={(e) =>
                setSocialForm({ ...socialForm, label: e.target.value })
              }
              placeholder="e.g. GitHub Profile or Divine on Substack"
              required
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Full URL
            </label>
            <input
              type="url"
              value={socialForm.url}
              onChange={(e) =>
                setSocialForm({ ...socialForm, url: e.target.value })
              }
              placeholder="https://github.com/luisdev or https://..."
              required
              className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => setSocialModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={socialSubmitting}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {socialSubmitting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Add Social Link</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
