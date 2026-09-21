import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "blog_admin_token";
const DEFAULT_PASSWORD = "admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export function isValidPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  // Simple verified session token based on password
  return token === Buffer.from(getAdminPassword()).toString("base64");
}

export function getAuthToken(): string {
  return Buffer.from(getAdminPassword()).toString("base64");
}

export { ADMIN_COOKIE_NAME };
