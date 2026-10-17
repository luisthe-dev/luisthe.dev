import nodemailer, { type Transporter } from "nodemailer";
import { getSiteSettings, getNewsletterSubscribers } from "@/lib/db/posts";
import { BlogPost } from "@/lib/types/blog";
import { marked } from "marked";

export interface MailConfig {
  transporter: Transporter;
  from: string;
}

export async function getMailTransporter(): Promise<MailConfig | null> {
  const settings = await getSiteSettings();
  const host = settings.smtp_host?.trim();
  if (!host) return null;

  const port = parseInt(settings.smtp_port || "587", 10);
  const secure = settings.smtp_secure === "true" || port === 465;
  const user = settings.smtp_user?.trim();
  const pass = settings.smtp_pass?.trim();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });

  const from =
    settings.smtp_from?.trim() ||
    (user ? `Divine Adesiyan <${user}>` : "Divine Adesiyan <no-reply@luisthe.dev>");

  return { transporter, from };
}

/**
 * Base email layout wrapper with modern aesthetics, dark card styling, and typography.
 */
function wrapEmailHtml(contentHtml: string, previewText?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Divine Adesiyan</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #090d16;
      padding: 40px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      padding: 32px 32px 24px 32px;
      border-bottom: 1px solid #1e293b;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    }
    .logo-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background-color: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .body {
      padding: 32px;
      font-size: 15px;
      color: #cbd5e1;
    }
    .post-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      padding: 3px 8px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .post-title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
      margin: 0 0 16px 0;
    }
    .post-excerpt {
      font-size: 15px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background-color: #ffffff;
      color: #090d16 !important;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      margin: 8px 0 20px 0;
    }
    .footer {
      padding: 24px 32px;
      background-color: #0b1120;
      border-top: 1px solid #1e293b;
      font-size: 11px;
      color: #64748b;
      text-align: center;
      line-height: 1.5;
    }
    .footer a {
      color: #94a3b8;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#090d16;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="logo-badge">High Contrast Dispatch</span>
        <h1 class="brand-title">Divine Adesiyan</h1>
        <div class="brand-sub">Technical Product Manager &amp; Systems Architect &bull; luisthe.dev</div>
      </div>
      <div class="body">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>You received this email because you subscribed to Divine Adesiyan's engineering newsletter on <a href="https://luisthe.dev">luisthe.dev</a>.</p>
        <p>&copy; ${new Date().getFullYear()} Luis Dev Limited. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatch an email to all active newsletter subscribers when a new post is published.
 */
export async function sendPostNotificationEmail(params: {
  post: BlogPost;
  origin?: string;
}): Promise<{ sent: boolean; recipientCount: number; error?: string }> {
  try {
    const mail = await getMailTransporter();
    if (!mail) {
      console.warn("SMTP not configured. Skipping post publication notification.");
      return { sent: false, recipientCount: 0, error: "SMTP host not configured" };
    }

    const subscribers = await getNewsletterSubscribers();
    if (subscribers.length === 0) {
      return { sent: true, recipientCount: 0 };
    }

    const baseUrl = params.origin || process.env.NEXTAUTH_URL || "https://luisthe.dev";
    const postUrl = `${baseUrl.replace(/\/$/, "")}/blog/${params.post.slug}`;

    const contentHtml = `
      <div class="post-badge">${params.post.category} &bull; ${params.post.readTime || "4 min read"}</div>
      <h2 class="post-title">${params.post.title}</h2>
      ${params.post.excerpt ? `<p class="post-excerpt">${params.post.excerpt}</p>` : ""}
      <div>
        <a href="${postUrl}" class="btn" target="_blank">Read Article on luisthe.dev &rarr;</a>
      </div>
    `;

    const html = wrapEmailHtml(contentHtml, params.post.excerpt || `New article: ${params.post.title}`);

    // Send emails in batches of 25 using BCC to maintain deliverability & privacy
    const emails = subscribers.map((s) => s.email);
    const BATCH_SIZE = 25;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await mail.transporter.sendMail({
        from: mail.from,
        to: mail.from,
        bcc: batch,
        subject: `New Article: ${params.post.title}`,
        html,
      });
    }

    return { sent: true, recipientCount: emails.length };
  } catch (err: unknown) {
    console.error("Failed to send post notification email:", err);
    const msg = err instanceof Error ? err.message : "Failed to dispatch email";
    return { sent: false, recipientCount: 0, error: msg };
  }
}

/**
 * Dispatch a custom broadcast email from the admin dashboard to all subscribers or a test address.
 */
export async function sendBroadcastEmail(params: {
  subject: string;
  body: string;
  previewText?: string;
  testEmailOnly?: string;
  origin?: string;
}): Promise<{ success: boolean; recipientCount: number; message: string }> {
  try {
    const mail = await getMailTransporter();
    if (!mail) {
      throw new Error("SMTP is not configured. Please set your SMTP credentials in Admin Settings.");
    }

    const formattedBody = await marked.parse(params.body, { breaks: true });
    const contentHtml = `
      <div style="line-height: 1.7; color: #cbd5e1;">
        ${formattedBody}
      </div>
    `;

    const html = wrapEmailHtml(contentHtml, params.previewText || params.subject);

    // If sending test email
    if (params.testEmailOnly) {
      await mail.transporter.sendMail({
        from: mail.from,
        to: params.testEmailOnly,
        subject: `[TEST] ${params.subject}`,
        html,
      });

      return {
        success: true,
        recipientCount: 1,
        message: `Test email successfully sent to ${params.testEmailOnly}`,
      };
    }

    // Sending to all subscribers
    const subscribers = await getNewsletterSubscribers();
    if (subscribers.length === 0) {
      return {
        success: true,
        recipientCount: 0,
        message: "No subscribers registered to receive this broadcast.",
      };
    }

    const emails = subscribers.map((s) => s.email);
    const BATCH_SIZE = 25;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await mail.transporter.sendMail({
        from: mail.from,
        to: mail.from,
        bcc: batch,
        subject: params.subject,
        html,
      });
    }

    return {
      success: true,
      recipientCount: emails.length,
      message: `Broadcast successfully sent to ${emails.length} subscriber${emails.length === 1 ? "" : "s"}!`,
    };
  } catch (err: unknown) {
    console.error("Failed to send broadcast email:", err);
    const msg = err instanceof Error ? err.message : "Failed to dispatch broadcast";
    throw new Error(msg);
  }
}
