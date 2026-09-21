import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPosts } from "@/lib/db/posts";
import AdminDashboardClient from "@/components/admin/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const { posts } = await getPosts({
    status: "all",
    limit: 100,
  });

  return <AdminDashboardClient initialPosts={posts} />;
}
