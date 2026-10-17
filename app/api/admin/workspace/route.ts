import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getWorkspaceItems,
  createWorkspaceItem,
  updateWorkspaceItem,
  deleteWorkspaceItem,
} from "@/lib/db/posts";

export async function GET(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const items = await getWorkspaceItems(category);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch workspace items:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace items" },
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
    const item = await createWorkspaceItem(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create workspace item:", error);
    return NextResponse.json(
      { error: "Failed to create workspace item" },
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
    const updated = await updateWorkspaceItem(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update workspace item:", error);
    return NextResponse.json(
      { error: "Failed to update workspace item" },
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
    await deleteWorkspaceItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete workspace item:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace item" },
      { status: 500 }
    );
  }
}
