import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/db/posts";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const settings = await getSiteSettings();

    const host = body.smtp_host || settings.smtp_host;
    const port = parseInt(body.smtp_port || settings.smtp_port || "587", 10);
    const user = body.smtp_user || settings.smtp_user;
    const pass = body.smtp_pass || settings.smtp_pass;
    const secure =
      (body.smtp_secure !== undefined ? body.smtp_secure : settings.smtp_secure) ===
        "true" || port === 465;

    if (!host) {
      return NextResponse.json(
        { error: "SMTP Host is required for testing connection" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    await transporter.verify();

    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${host}:${port}. SMTP server is ready to dispatch emails.`,
    });
  } catch (err: unknown) {
    console.error("SMTP verification error:", err);
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Failed to connect to SMTP server. Please verify your host, port, and credentials.";
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 400 }
    );
  }
}
