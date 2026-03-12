export type BlogSection = {
  heading?: string;
  paragraphs: string[];
  checklist?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  coverImage: string;
  sections: BlogSection[];
};

const blogPosts: BlogPost[] = [
  {
    slug: "rebuilding-blog-fixam-modern-stack",
    title: "Rebuilding blog.fixam.co.uk on a modern stack",
    excerpt:
      "Why we moved away from a legacy static template and how the new structure improves speed, SEO, and maintainability.",
    publishedAt: "2026-03-12",
    author: "Fixam Team",
    category: "Platform",
    tags: ["website", "seo", "performance"],
    readingMinutes: 6,
    coverImage: "/images/illustration.webp",
    sections: [
      {
        paragraphs: [
          "The previous blog started as a lightweight personal template. It worked for a while, but it became difficult to evolve into a content platform for clients and prospects.",
          "We have now introduced a structured blog architecture with proper metadata, article routes, a feed, and a migration path for legacy URLs.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "Each article now has its own canonical URL, page metadata, and structured data. This makes discovery and sharing more reliable.",
          "The new design is responsive, cleaner on mobile, and aligned with the rest of the Fixam brand.",
        ],
        checklist: [
          "Dedicated /blog index with featured and recent posts",
          "Static article pages with strong metadata defaults",
          "RSS feed at /blog/rss.xml",
          "Legacy redirects for /projects and old index paths",
        ],
      },
      {
        heading: "What happens next",
        paragraphs: [
          "We will continue migrating old content into article format and publish a regular cadence around cyber security, Microsoft 365, and SME IT operations.",
        ],
      },
    ],
  },
  {
    slug: "cyber-essentials-readiness-checklist-2026",
    title: "Cyber Essentials readiness checklist for SMEs (2026)",
    excerpt:
      "A practical pre-audit checklist to reduce surprises and improve your pass rate for Cyber Essentials.",
    publishedAt: "2026-03-10",
    author: "Fixam Team",
    category: "Cyber Security",
    tags: ["cyber essentials", "sme", "security controls"],
    readingMinutes: 7,
    coverImage: "/images/screenshot.webp",
    sections: [
      {
        paragraphs: [
          "Cyber Essentials is often treated as a paperwork task. In practice, most failures come from incomplete control implementation, not documentation quality.",
          "A short technical pre-check before submission can remove most avoidable issues.",
        ],
      },
      {
        heading: "Control areas to verify first",
        paragraphs: [
          "Start with the controls that usually fail during self-assessment or external review.",
        ],
        checklist: [
          "MFA enforced for admin access and cloud apps",
          "Unique admin accounts with least privilege",
          "Patch SLAs for operating systems and critical apps",
          "Endpoint protection deployed and centrally monitored",
          "Firewall/router management interfaces restricted",
        ],
      },
      {
        heading: "Evidence pack",
        paragraphs: [
          "Keep lightweight evidence ready: policy extracts, screenshots, device inventory snapshots, and patch status reports.",
          "This keeps your certification process faster and lowers rework if scope changes.",
        ],
      },
    ],
  },
  {
    slug: "microsoft-365-security-baseline-for-growing-teams",
    title: "Microsoft 365 security baseline for growing teams",
    excerpt:
      "A straightforward baseline for Entra ID, Exchange, and endpoint controls that small teams can maintain.",
    publishedAt: "2026-03-06",
    author: "Fixam Team",
    category: "Microsoft 365",
    tags: ["microsoft 365", "entra", "intune"],
    readingMinutes: 8,
    coverImage: "/images/screenshot.png",
    sections: [
      {
        paragraphs: [
          "Microsoft 365 can be secure by default, but only if the right controls are enabled in a sensible order.",
          "The goal is a baseline that is strong enough to reduce risk while staying manageable for small internal teams.",
        ],
      },
      {
        heading: "Baseline controls",
        paragraphs: [
          "Implement these controls first before moving into advanced tuning and custom conditional access policies.",
        ],
        checklist: [
          "Disable legacy authentication globally",
          "Require MFA for all users; enforce stronger policies for admins",
          "Enable anti-phishing and safe links in Defender for Office",
          "Set secure defaults for external sharing in SharePoint/OneDrive",
          "Enroll managed endpoints with compliance rules in Intune",
        ],
      },
      {
        heading: "Operational hygiene",
        paragraphs: [
          "Set a monthly security review cadence with clear owners and one-page action tracking.",
          "Most security regressions happen when nobody owns recurring checks after the initial rollout.",
        ],
      },
    ],
  },
  {
    slug: "incident-response-runbook-template-for-small-it-teams",
    title: "Incident response runbook template for small IT teams",
    excerpt:
      "A concise runbook format to help small teams respond consistently when incidents happen.",
    publishedAt: "2026-03-02",
    author: "Fixam Team",
    category: "Operations",
    tags: ["incident response", "runbook", "it support"],
    readingMinutes: 5,
    coverImage: "/images/illustration.webp",
    sections: [
      {
        paragraphs: [
          "Small teams usually do not need a long incident response playbook. They need a clear runbook that can be followed under pressure.",
          "A good runbook should reduce decision time, clarify responsibilities, and preserve evidence quality.",
        ],
      },
      {
        heading: "Minimum runbook sections",
        paragraphs: [
          "Keep it short, versioned, and available to the people likely to be on first response.",
        ],
        checklist: [
          "Severity criteria and escalation rules",
          "Containment actions by incident type",
          "Internal and external comms templates",
          "Evidence collection checklist",
          "Post-incident review and follow-up ownership",
        ],
      },
      {
        heading: "Drill cadence",
        paragraphs: [
          "Run tabletop exercises every quarter. Even one 45-minute drill highlights gaps that formal documentation will miss.",
        ],
      },
    ],
  },
];

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
