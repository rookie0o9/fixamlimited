"use client";

import { submitFeedback, type FeedbackFormState } from "@/actions/feedback";
import useModalContext from "@/hooks/use-modal-context";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState: FeedbackFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Sending..." : "Send feedback"}
    </button>
  );
}

const TRUSTPILOT_REVIEW_URL = "https://www.trustpilot.com/evaluate/fixam.co.uk";

export default function FeedbackForm() {
  const { closeModal } = useModalContext();
  const [state, formAction] = useFormState(submitFeedback, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      window.dispatchEvent(new CustomEvent("fixam-feedback-submitted"));
    }
  }, [state.status]);

  const stars = useMemo(() => {
    const current = rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;
      const active = value <= current;
      return (
        <label
          key={value}
          className="cursor-pointer rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
          title={`${value} star${value === 1 ? "" : "s"}`}
        >
          <input
            type="radio"
            name="rating"
            value={value}
            className="sr-only"
            onChange={() => setRating(value)}
            required
          />
          <Star
            className={`h-6 w-6 ${
              active ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        </label>
      );
    });
  }, [rating]);

  if (state.status === "success") {
    return (
      <div className="space-y-4">
        <h2 className="tracking-tighter">Leave feedback</h2>
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
            href={TRUSTPILOT_REVIEW_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Leave a Trustpilot review
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="tracking-tighter">Leave feedback</h2>
        <p className="text-muted-foreground">
          Thanks for using Fixam — your feedback helps us improve.
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
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
              Email <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
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
            <label htmlFor="position" className="text-sm font-semibold">
              Role <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="position"
              name="position"
              type="text"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="IT Manager"
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
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">Rating</legend>
            <div className="flex items-center gap-1">{stars}</div>
          </fieldset>
          {fieldErrors.rating ? (
            <p className="text-xs text-destructive">{fieldErrors.rating}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="feedback" className="text-sm font-semibold">
            Feedback
          </label>
          <textarea
            id="feedback"
            name="feedback"
            required
            rows={6}
            className={`w-full resize-y rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              fieldErrors.feedback ? "border-destructive" : ""
            }`}
            placeholder="What did you like? Anything we could improve?"
          />
          {fieldErrors.feedback ? (
            <p className="text-xs text-destructive">{fieldErrors.feedback}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="flex items-start gap-3 text-sm">
            <input
              name="publishConsent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border"
            />
            <span>I’m happy for this to appear as a testimonial on fixam.co.uk.</span>
          </label>
        </div>

        <div className="flex flex-col gap-3 min-[420px]:flex-row pt-2">
          <SubmitButton />
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Prefer a public review?{" "}
          <a
            href={TRUSTPILOT_REVIEW_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-4 hover:text-primary"
          >
            Leave one on Trustpilot
          </a>
          .
        </p>
      </form>
    </div>
  );
}

