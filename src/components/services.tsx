import { LuHardDrive, LuLaptop, LuPower } from "react-icons/lu";

const services = [
  {
    title: "Business IT Support",
    description:
      "Unlimited helpdesk, remote monitoring and on-site escalation when your team needs extra hands.",
    Icon: LuLaptop,
  },
  {
    title: "Microsoft 365",
    description:
      "Migrations, licensing and security hardening across Entra, Intune and Exchange.",
    Icon: LuHardDrive,
  },
  {
    title: "Cyber Security",
    description:
      "Policies, training and tools such as XDR and secure email to lower your cyber risk.",
    Icon: LuPower,
  },
  {
    title: "Connectivity",
    description:
      "Business broadband, leased lines and resilient 4G/5G backup to keep everyone online.",
    Icon: LuLaptop,
  },
  {
    title: "Cloud Backup",
    description:
      "Automated, monitored backup for endpoints, on-prem servers and Microsoft 365.",
    Icon: LuHardDrive,
  },
  {
    title: "IT Consultancy",
    description:
      "Audits, roadmaps and solution design aligned to risk, growth plans and budget.",
    Icon: LuPower,
  },
];

export default function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-16 bg-muted">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="tracking-tighter">Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Cloud-first support packages that keep your people productive and secure.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-xl border bg-background p-6 text-left shadow-sm"
            >
              <Icon className="h-12 w-12 text-primary" />
              <div className="space-y-2 flex-1">
                <h3>{title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
