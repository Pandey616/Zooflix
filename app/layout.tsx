import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  ...(siteConfig.isPublicUrlConfigured ? { metadataBase: new URL(siteConfig.url) } : {}),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  ...(siteConfig.isPublicUrlConfigured
    ? {
        alternates: { canonical: "/" },
        openGraph: {
          type: "website" as const,
          siteName: siteConfig.name,
          title: siteConfig.title,
          description: siteConfig.description,
          url: siteConfig.url,
        },
      }
    : {}),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="shell footer-inner">
            <span>Zooflix 2.0</span>
            <span>A field guide for curious minds.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
