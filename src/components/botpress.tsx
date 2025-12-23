"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    botpress?: {
      initialized: boolean;
      init: (config: BotpressInitConfig) => void;
      updateUser?: (user: unknown) => Promise<void>;
    };
  }
}

type BotpressInitConfig = {
  botId: string;
  clientId: string;
  configuration?: Record<string, unknown>;
  theme?: unknown;
  style?: string;
  defaultState?: "opened" | "closed";
};

const INJECT_SRC = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
const CONFIG_SRC =
  "https://files.bpcontent.cloud/2025/12/23/01/20251223013207-8A8QRIIN.js";
const INJECT_ID = "botpress-webchat-inject";
const CONFIG_ID = "botpress-webchat-config";

function getServiceSlugFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && parts[0] === "services") return parts[1];
  return undefined;
}

function loadScriptOnce(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load script: ${src}`)),
      { once: true }
    );

    document.body.appendChild(script);
  });
}

export default function Botpress() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadScriptOnce(INJECT_ID, INJECT_SRC);
        if (cancelled) return;
        await loadScriptOnce(CONFIG_ID, CONFIG_SRC);
      } catch (error) {
        console.error("Failed to load Botpress:", error);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const botpress = window.botpress;
    if (!botpress?.initialized || !botpress.updateUser) return;

    const url = window.location.href;
    const query = window.location.search.replace(/^\?/, "");
    const serviceSlug = getServiceSlugFromPathname(pathname);

    botpress
      .updateUser({
        data: {
          currentUrl: url,
          pathname,
          query,
          serviceSlug,
        },
      })
      .catch((error) => console.error("Failed to update Botpress user:", error));
  }, [pathname]);

  return null;
}
