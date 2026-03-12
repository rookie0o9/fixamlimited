import Botpress from "@/components/botpress";
import BlogFooter from "@/components/blog-footer";
import BlogHeader from "@/components/blog-header";
import WhatsppIcon from "@/components/whatsapp-icon";
import type { PropsWithChildren } from "react";

export default function BlogLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <BlogHeader />
      <main className="flex-1 pt-14 md:pt-10 lg:pt-6 bg-background">{children}</main>
      <BlogFooter />
      <WhatsppIcon />
      <Botpress />
    </div>
  );
}
