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
    getPosts({ status: "all", limit: 100 }).catch((err) => {
      console.error("Admin dashboard: failed to load posts:", err);
      return { posts: [], total: 0 };
    }),
    getTimelineEvents().catch((err) => {
      console.error("Admin dashboard: failed to load timeline events:", err);
      return [];
    }),
    getCompetencies().catch((err) => {
      console.error("Admin dashboard: failed to load competencies:", err);
      return [];
    }),
    getWorkspaceItems().catch((err) => {
      console.error("Admin dashboard: failed to load workspace items:", err);
      return [];
    }),
    getSocialLinks().catch((err) => {
      console.error("Admin dashboard: failed to load social links:", err);
      return [];
    }),
    getSiteSettings().catch((err) => {
      console.error("Admin dashboard: failed to load site settings:", err);
      return {};
    }),
    getNewsletterSubscribers().catch((err) => {
      console.error("Admin dashboard: failed to load subscribers:", err);
      return [];
    }),
  ]);

  // Safely serialize database records (including Date fields) for the Client Component boundary
  const safePosts = JSON.parse(JSON.stringify(postsData?.posts || []));
  const safeTimelineEvents = JSON.parse(JSON.stringify(timelineEvents || []));
  const safeCompetencies = JSON.parse(JSON.stringify(competencies || []));
  const safeWorkspaceItems = JSON.parse(JSON.stringify(workspaceItems || []));
  const safeSocialLinks = JSON.parse(JSON.stringify(socialLinks || []));
  const safeSettings = JSON.parse(JSON.stringify(siteSettings || {}));
  const safeSubscribers = JSON.parse(JSON.stringify(subscribers || []));

  return (
    <AdminDashboardClient
      initialPosts={safePosts}
      initialTimelineEvents={safeTimelineEvents}
      initialCompetencies={safeCompetencies}
      initialWorkspaceItems={safeWorkspaceItems}
      initialSocialLinks={safeSocialLinks}
      initialSettings={safeSettings}
      initialSubscribers={safeSubscribers}
    />
  );
}
