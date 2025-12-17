"use client";
import { useEffect } from 'react'

// Add this type declaration at the top of the file
declare global {
  interface Window {
    /* spell-ignore: botpress */
    botpressWebChat?: {
      init: (config: BotpressConfig) => void;
    };
  }
}

interface BotpressConfig {
  botId: string;
  clientId: string;
  hostUrl: string;
  messagingUrl: string;
  composerPlaceholder: string;
  botName: string;
  avatarUrl?: string;
  theme?: string;
  stylesheet?: string;
  [key: string]: string | boolean | undefined;
}

export default function Botpress() {
  useEffect(() => {
    // Inject the main webchat script
    const script1 = document.createElement('script')
    script1.src = "https://cdn.botpress.cloud/webchat/v2.1/inject.js"
    script1.async = true
    document.body.appendChild(script1)

    // Inject the config script
    const script2 = document.createElement('script')
    script2.src = "https://mediafiles.botpress.cloud/ccaafe5a-744e-4663-8a08-954745edbc86/webchat/v2.1/config.js"
    script2.async = true
    document.body.appendChild(script2)

    script2.onload = () => {
      
      window.botpressWebChat?.init({
        /* spell-ignore: botpress */
        "botId": "ccaafe5a-744e-4663-8a08-954745edbc86",
        "clientId": "27c1cd90-ad39-416d-beed-8160ad5e745d",
        "hostUrl": "https://cdn.botpress.cloud/webchat/v2.1",
        "messagingUrl": "https://messaging.botpress.cloud",
        "composerPlaceholder": "Chat with our support bot",
        "botName": "Customer Support",
        // You can customize these options as needed
        "avatarUrl": "https://your-avatar-url.com/avatar.png",
        "theme": "light",
        "stylesheet": "https://your-stylesheet-url.com/style.css"
      })
    }

    return () => {
      document.body.removeChild(script1)
      document.body.removeChild(script2)
    }
  }, [])

  return null
}