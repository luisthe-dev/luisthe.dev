import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from "@/lib/db/posts";

export async function GET(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const events = await getTimelineEvents(category);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch timeline events:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const event = await createTimelineEvent(body);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create timeline event:", error);
    return NextResponse.json(
      { error: "Failed to create timeline event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const updated = await updateTimelineEvent(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update timeline event:", error);
    return NextResponse.json(
      { error: "Failed to update timeline event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await deleteTimelineEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete timeline event:", error);
    return NextResponse.json(
      { error: "Failed to delete timeline event" },
      { status: 500 }
    );
  }
}
