import type { IconType } from "react-icons";
import { LuHardDrive, LuLaptop, LuPower } from "react-icons/lu";

export type Service = {
  slug: string;
  title: string;
  description: string;
  overview: string;
  includes: string[];
  Icon: IconType;
};

export const services: Service[] = [
  {
    slug: "business-it-support",
    title: "Business IT Support",
    description:
      "Unlimited helpdesk, remote monitoring and on-site escalation when your team needs extra hands.",
    overview:
      "Proactive, cloud-first IT support for SMEs that want fast fixes today and fewer issues tomorrow.",
    includes: [
      "Unlimited helpdesk with friendly engineers",
      "Remote monitoring, patching and proactive maintenance",
      "On-site escalation when you need extra hands",
      "User onboarding/offboarding and device setup",
      "Monthly reporting and improvement recommendations",
    ],
    Icon: LuLaptop,
  },
  {
    slug: "microsoft-365",
    title: "Microsoft 365",
    description:
      "Migrations, licensing and security hardening across Entra, Intune and Exchange.",
    overview:
      "Set up, migrate and secure Microsoft 365 so your team can collaborate safely from anywhere.",
    includes: [
      "Tenant setup, migrations and onboarding",
      "Licensing guidance and cost optimisation",
      "Entra ID security hardening and best practices",
      "Intune device enrolment and policy management",
      "Exchange Online, SharePoint and Teams configuration",
    ],
    Icon: LuHardDrive,
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    description:
      "Policies, training and tools such as XDR and secure email to lower your cyber risk.",
    overview:
      "A pragmatic security programme that reduces risk without slowing your people down.",
    includes: [
      "Security reviews and risk assessments",
      "Email and endpoint protection (EDR/XDR) guidance",
      "MFA, conditional access and least-privilege access",
      "User awareness training and security policies",
      "Incident response planning and ongoing improvements",
    ],
    Icon: LuPower,
  },
  {
    slug: "connectivity",
    title: "Connectivity",
    description:
      "Business broadband, leased lines and resilient 4G/5G backup to keep everyone online.",
    overview:
      "Reliable business internet, Wi‑Fi and failover designed to keep your team connected.",
    includes: [
      "Business broadband and leased line procurement",
      "Firewall, switching and Wi‑Fi configuration",
      "Resilient 4G/5G failover for continuity",
      "Monitoring, SLA escalation and ISP liaison",
      "Site surveys and network documentation",
    ],
    Icon: LuLaptop,
  },
  {
    slug: "cloud-backup",
    title: "Cloud Backup",
    description:
      "Automated, monitored backup for endpoints, on-prem servers and Microsoft 365.",
    overview:
      "Automated backup with monitoring and tested restores to protect data and minimise downtime.",
    includes: [
      "Automated backups for endpoints and servers",
      "Microsoft 365 backup (Exchange, OneDrive, SharePoint)",
      "Monitoring, alerts and regular health checks",
      "Retention policies tailored to your needs",
      "Restore testing and documented recovery process",
    ],
    Icon: LuHardDrive,
  },
  {
    slug: "it-consultancy",
    title: "IT Consultancy",
    description:
      "Audits, roadmaps and solution design aligned to risk, growth plans and budget.",
    overview:
      "Straightforward advice, audits and roadmaps to help you make confident IT decisions.",
    includes: [
      "Current-state audits and gap analysis",
      "Roadmaps aligned to growth and budget",
      "Project planning and delivery support",
      "Vendor selection and technical due diligence",
      "Architecture and solution design across cloud and on-prem",
    ],
    Icon: LuPower,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

