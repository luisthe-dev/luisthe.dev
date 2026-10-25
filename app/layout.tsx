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
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://luisthe.dev"),
  title: {
    default: "Divine Adesiyan | Technical Product Manager & Systems Architect",
    template: "%s | Divine Adesiyan",
  },
  description:
    "Founder of Luis Dev Limited, Co-Founder of MyInvite, Senior Backend Engineer. 8+ years building high-throughput microservices, fintech engines, and distributed architectures.",
  openGraph: {
    title: "Divine Adesiyan | Technical Product Manager & Systems Architect",
    description:
      "Founder of Luis Dev Limited, Co-Founder of MyInvite, Senior Backend Engineer. 8+ years building high-throughput microservices, fintech engines, and distributed architectures.",
    url: "https://luisthe.dev",
    siteName: "Divine Adesiyan",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/24.jpg",
        width: 1200,
        height: 630,
        alt: "Divine Adesiyan | Technical Product Manager & Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divine Adesiyan | Technical Product Manager & Systems Architect",
    description:
      "8+ years building high-throughput microservices, fintech engines, and distributed architectures.",
    creator: "@luisthe___dev",
    images: ["/24.jpg"],
  },
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
