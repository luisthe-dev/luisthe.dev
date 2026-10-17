import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/db/posts";
import { isAuthenticated } from "@/lib/auth";
import { sendPostNotificationEmail } from "@/lib/mail";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const prevPost = await getPostById(id);
    const updated = await updatePost(id, body);

    // If publishing a draft or explicitly requested
    if (
      updated.status === "published" &&
      (prevPost?.status !== "published" || body.notifySubscribers === true)
    ) {
      const origin = request.headers.get("origin") || undefined;
      sendPostNotificationEmail({ post: updated, origin }).catch((err) =>
        console.error("Failed to notify subscribers on post update:", err)
      );
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Failed to update post:", error);
    const msg = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete post:", error);
    const msg = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
