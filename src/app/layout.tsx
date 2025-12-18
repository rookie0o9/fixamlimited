import { Oswald, Roboto } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import Script from "next/script";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: ["400", "500", "600"],
});

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (() => {
              try {
                const stored = localStorage.getItem("theme");
                const systemPrefersDark =
                  window.matchMedia &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme =
                  stored === "dark" || stored === "light"
                    ? stored
                    : systemPrefersDark
                      ? "dark"
                      : "light";

                const root = document.documentElement;
                if (theme === "dark") root.classList.add("dark");
                else root.classList.remove("dark");
              } catch {}
            })();
          `}
        </Script>
        {/* Google Tag Manager (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CBRBTJCBQ5"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CBRBTJCBQ5');
          `}
        </Script>
      </head>
      <body
        className={`${roboto.variable} ${oswald.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
