import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sendBroadcastEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { subject, body, previewText, testEmailOnly } = json;

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: "Broadcast subject is required" },
        { status: 400 }
      );
    }

    if (!body || !body.trim()) {
      return NextResponse.json(
        { error: "Broadcast body content is required" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || undefined;

    const result = await sendBroadcastEmail({
      subject: subject.trim(),
      body: body.trim(),
      previewText: previewText?.trim(),
      testEmailOnly: testEmailOnly?.trim() || undefined,
      origin,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Broadcast dispatch failed:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to dispatch broadcast email";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
