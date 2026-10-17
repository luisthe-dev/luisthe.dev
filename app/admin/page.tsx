import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  getPosts,
  getTimelineEvents,
  getCompetencies,
  getWorkspaceItems,
  getSocialLinks,
  getSiteSettings,
  getNewsletterSubscribers,
} from "@/lib/db/posts";
import AdminDashboardClient from "@/components/admin/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const [
    postsData,
    timelineEvents,
    competencies,
    workspaceItems,
    socialLinks,
    siteSettings,
    subscribers,
  ] = await Promise.all([
    getPosts({ status: "all", limit: 100 }),
    getTimelineEvents(),
    getCompetencies(),
    getWorkspaceItems(),
    getSocialLinks(),
    getSiteSettings(),
    getNewsletterSubscribers(),
  ]);

  return (
    <AdminDashboardClient
      initialPosts={postsData.posts}
      initialTimelineEvents={timelineEvents}
      initialCompetencies={competencies}
      initialWorkspaceItems={workspaceItems}
      initialSocialLinks={socialLinks}
      initialSettings={siteSettings}
      initialSubscribers={subscribers}
    />
  );
}
