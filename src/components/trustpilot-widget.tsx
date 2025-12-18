"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TrustpilotApi = {
  loadFromElement?: (element: Element, force?: boolean) => void;
};

type TrustpilotWindow = Window & {
  Trustpilot?: TrustpilotApi;
};

const TRUSTPILOT_REVIEW_URL = "https://www.trustpilot.com/review/fixam.co.uk";

export default function TrustpilotWidget() {
  const businessUnitId = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID?.trim();
  const templateId = process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID?.trim();
  const locale = process.env.NEXT_PUBLIC_TRUSTPILOT_LOCALE?.trim() || "en-GB";

  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const loadWidget = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    const trustpilot = (window as TrustpilotWindow).Trustpilot;
    if (trustpilot?.loadFromElement) {
      trustpilot.loadFromElement(element, true);
    }
  }, []);

  useEffect(() => {
    if (!scriptReady) return;
    loadWidget();
  }, [scriptReady, theme, loadWidget]);

  if (!businessUnitId || !templateId) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-semibold">Trustpilot reviews</h3>
          <p className="text-sm text-muted-foreground">
            Live reviews powered by Trustpilot.
          </p>
        </div>
        <a
          href={TRUSTPILOT_REVIEW_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          View on Trustpilot
        </a>
      </div>

      <div className="mt-6">
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
        <div
          ref={containerRef}
          className="trustpilot-widget"
          data-locale={locale}
          data-template-id={templateId}
          data-businessunit-id={businessUnitId}
          data-style-height="240px"
          data-style-width="100%"
          data-theme={theme}
        >
          <a href={TRUSTPILOT_REVIEW_URL} target="_blank" rel="noreferrer noopener">
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
}
