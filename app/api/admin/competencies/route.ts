import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getCompetencies,
  createCompetency,
  updateCompetency,
  deleteCompetency,
} from "@/lib/db/posts";

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const items = await getCompetencies();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch competencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch competencies" },
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
    const item = await createCompetency(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create competency:", error);
    return NextResponse.json(
      { error: "Failed to create competency" },
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
    const updated = await updateCompetency(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update competency:", error);
    return NextResponse.json(
      { error: "Failed to update competency" },
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
    await deleteCompetency(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete competency:", error);
    return NextResponse.json(
      { error: "Failed to delete competency" },
      { status: 500 }
    );
  }
}
