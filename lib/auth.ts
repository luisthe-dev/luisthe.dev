import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const ADMIN_COOKIE_NAME = "blog_admin_token";

const SESSION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.DATABASE_URL ||
  "luisthe-dev-secure-session-key";

interface SessionPayload {
  email: string;
  exp: number;
}

export function createSessionToken(email: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload: SessionPayload = { email, exp };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadStr)
    .digest("base64url");
  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadStr)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSig)
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(payloadStr, "base64url").toString("utf-8")
    ) as SessionPayload;

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(
  passwordAttempt: string,
  emailAttempt?: string
): Promise<{ success: boolean; user?: { id: string; email: string; name: string } }> {
  try {
    // If email provided, find by email; otherwise find primary admin
    const adminUser = emailAttempt
      ? await prisma.adminUser.findUnique({ where: { email: emailAttempt } })
      : await prisma.adminUser.findFirst();

    if (!adminUser) {
      return { success: false };
    }

    const matches = await bcrypt.compare(passwordAttempt, adminUser.passwordHash);
    if (!matches) {
      return { success: false };
    }

    return {
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { success: false };
  }
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminUser = await prisma.adminUser.findFirst();
    if (!adminUser) {
      return { success: false, error: "Admin user not found" };
    }

    const matches = await bcrypt.compare(currentPassword, adminUser.passwordHash);
    if (!matches) {
      return { success: false, error: "Incorrect current password" };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "New password must be at least 6 characters long",
      };
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { passwordHash: newHash },
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update password";
    return { success: false, error: errorMsg };
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    const payload = verifySessionToken(token);
    if (!payload) return false;

    // Verify user exists in database
    const user = await prisma.adminUser.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    return !!user;
  } catch {
    return false;
  }
}
