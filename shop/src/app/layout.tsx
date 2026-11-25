import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MiniCartDrawer } from "@/components/layout/MiniCartDrawer";
import { FloatingContactWidget } from "@/components/layout/FloatingContactWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchMenu, fetchSiteSettings } from "@/lib/storefront";
import { getServerLocale, getServerPathname } from "@/lib/i18n/server";
import { delocalizePath, localizeHref } from "@/lib/i18n";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  DEFAULT_DESCRIPTION,
  DEFAULT_DESCRIPTION_EN,
  DEFAULT_TITLE_EN,
  DEFAULT_TITLE_VI,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale();
  const pathname = getServerPathname();
  const isEn = locale === "en";

  const defaultTitle = isEn ? DEFAULT_TITLE_EN : DEFAULT_TITLE_VI;
  const description = isEn ? DEFAULT_DESCRIPTION_EN : DEFAULT_DESCRIPTION;

  const viPath = delocalizePath(pathname).split(/[?#]/)[0] || "/";
  const enPath = localizeHref(viPath, "en");
  const canonicalPath = isEn ? enPath : viPath;
  const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const viAlt = `${SITE_URL}${viPath === "/" ? "" : viPath}`;
  const enAlt = `${SITE_URL}${enPath}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        vi: viAlt,
        en: enAlt,
        "x-default": viAlt,
      },
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: isEn ? "en_US" : "vi_VN",
      alternateLocale: [isEn ? "vi_VN" : "en_US"],
      type: "website",
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/logo-11sport-icon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/logo-11sport-icon.svg",
      apple: "/logo-11sport-icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getServerLocale();
  const [settings, menuItems] = await Promise.all([
    fetchSiteSettings(),
    fetchMenu(),
  ]);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-surface-page text-ink-primary font-sans antialiased">
        <JsonLd
          data={[
            buildOrganizationJsonLd(locale),
            buildWebSiteJsonLd(locale),
          ]}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-store-forest focus:text-white focus:font-semibold"
        >
          {locale === "en"
            ? "Skip to main content"
            : "Chuyển đến nội dung chính"}
        </a>

        <Header settings={settings} menuItems={menuItems} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />

        <MiniCartDrawer />
        <FloatingContactWidget settings={settings} />
      </body>
    </html>
  );
}
