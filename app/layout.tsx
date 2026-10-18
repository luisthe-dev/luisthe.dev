import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import HeaderComponent from "@/components/main/header";
import FooterComponent from "@/components/main/footer";
import { getSiteSettings, getSocialLinks } from "@/lib/db/posts";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Divine Adesiyan | Technical Product Manager & Systems Architect",
  description:
    "Founder of Luis Dev Limited, Co-Founder of MyInvite, Senior Backend Engineer. 8+ years building high-throughput microservices, fintech engines, and distributed architectures.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteSettings, socialLinks] = await Promise.all([
    getSiteSettings().catch(() => ({})),
    getSocialLinks(true).catch(() => []),
  ]);

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <HeaderComponent settings={siteSettings} />
            {children}
            <FooterComponent settings={siteSettings} socialLinks={socialLinks} />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
