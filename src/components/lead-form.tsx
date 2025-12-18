"use client";

import { submitLead, type LeadFormState } from "@/actions/leads";
import { services } from "@/lib/services";
import useModalContext from "@/hooks/use-modal-context";
import { useFormState, useFormStatus } from "react-dom";

type LeadKind = "contact" | "inquiry";

type LeadFormProps = {
  kind: LeadKind;
  defaultServiceSlug?: string;
};

const initialState: LeadFormState = { status: "idle" };

function SubmitButton({ kind }: { kind: LeadKind }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Sending..." : kind === "inquiry" ? "Send enquiry" : "Send message"}
    </button>
  );
}

export default function LeadForm({ kind, defaultServiceSlug }: LeadFormProps) {
  const { closeModal } = useModalContext();
  const [state, formAction] = useFormState(submitLead, initialState);

  const title = kind === "inquiry" ? "Request pricing" : "Contact Fixam";
  const description =
    kind === "inquiry"
      ? "Tell us what you need and we'll come back with a quick recommendation and pricing."
      : "Send us a message and we'll get back to you shortly.";

  if (state.status === "success") {
    return (
      <div className="space-y-4">
        <h2 className="tracking-tighter">{title}</h2>
        <p className="text-muted-foreground">{state.message}</p>
        <div className="flex flex-col gap-3 min-[420px]:flex-row pt-2">
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Close
          </button>
          <a
            href="mailto:info@fixam.co.uk"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Email us instead
          </a>
        </div>
      </div>
    );
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="tracking-tighter">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="kind" value={kind} />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-semibold">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className={`h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                fieldErrors.fullName ? "border-destructive" : ""
              }`}
              placeholder="Jane Doe"
            />
            {fieldErrors.fullName ? (
              <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                fieldErrors.email ? "border-destructive" : ""
              }`}
              placeholder="jane@company.com"
            />
            {fieldErrors.email ? (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-semibold">
              Phone <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="+44 7..."
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="company" className="text-sm font-semibold">
              Company <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Fixam Ltd"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="serviceSlug" className="text-sm font-semibold">
            Which service would you like to enquire about?
            {kind === "inquiry" ? null : (
              <span className="text-muted-foreground font-normal"> (optional)</span>
            )}
          </label>
          <select
            id="serviceSlug"
            name="serviceSlug"
            defaultValue={defaultServiceSlug ?? ""}
            required={kind === "inquiry"}
            className={`h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              fieldErrors.serviceSlug ? "border-destructive" : ""
            }`}
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
          {fieldErrors.serviceSlug ? (
            <p className="text-xs text-destructive">{fieldErrors.serviceSlug}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="text-sm font-semibold">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className={`w-full resize-y rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              fieldErrors.message ? "border-destructive" : ""
            }`}
            placeholder="Tell us a bit about your setup and what you need help with…"
          />
          {fieldErrors.message ? (
            <p className="text-xs text-destructive">{fieldErrors.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="flex items-start gap-3 text-sm">
            <input
              name="consent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border"
              required
            />
            <span>
              I agree that Fixam can contact me about this request.
            </span>
          </label>
          {fieldErrors.consent ? (
            <p className="text-xs text-destructive">{fieldErrors.consent}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 min-[420px]:flex-row pt-2">
          <SubmitButton kind={kind} />
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Prefer email? Write to{" "}
          <a
            href="mailto:info@fixam.co.uk"
            className="underline underline-offset-4 hover:text-primary"
          >
            info@fixam.co.uk
          </a>{" "}
          or call{" "}
          <a
            href="tel:+447733738545"
            className="underline underline-offset-4 hover:text-primary"
          >
            +44 7733 738545
          </a>
          .
        </p>
      </form>
    </div>
  );
}
