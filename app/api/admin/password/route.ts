import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, updateAdminPassword } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new passwords are required" },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update password" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
