import React from "react";
import MyIntroComponent from "@/components/me/intro";
import MyTimelineComponent from "@/components/me/timeline";
import MyWorkspaceComponent from "@/components/me/workspace";
import { getTimelineEvents } from "@/lib/db/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Divine Adesiyan",
  description:
    "Engineering Leader, Software Architect, Founder of Luis Dev Limited, and Co-founder of MyInvite. Experience, timeline, and platforms.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const events = await getTimelineEvents();

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <MyIntroComponent />
        <MyTimelineComponent events={events} />
        <MyWorkspaceComponent />
      </div>
    </div>
  );
}
