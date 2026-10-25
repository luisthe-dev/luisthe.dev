import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Lightweight in-memory rate limiting per IP (2-second cooldown)
const ipRateMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const lastRequest = ipRateMap.get(ip);

    if (lastRequest && now - lastRequest < 2000) {
      return NextResponse.json(
        { error: "Please wait a moment before subscribing again." },
        { status: 429 }
      );
    }
    ipRateMap.set(ip, now);

    // Prune stale IPs periodically
    if (ipRateMap.size > 1000) {
      for (const [k, timestamp] of ipRateMap.entries()) {
        if (now - timestamp > 60000) ipRateMap.delete(k);
      }
    }

    const { email } = await request.json();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: {},
      create: {
        email: cleanEmail,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully!",
      subscriber,
    });
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
