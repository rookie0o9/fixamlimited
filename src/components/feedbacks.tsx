"use client";

import Feedback from "@/components/feedback";
import ModalTrigger from "@/components/modal-trigger";
import TrustpilotWidget from "@/components/trustpilot-widget";
import { ModalIDs } from "@/lib/constants";
import { useCallback, useEffect, useState } from "react";

type FeedbackItem = {
  avatar: string;
  name: string;
  position: string;
  feedback: string;
  rating?: number;
  source?: string;
};

type FeedbacksResponse = {
  generatedAt: string;
  items: FeedbackItem[];
};

const TRUSTPILOT_REVIEW_URL = "https://www.trustpilot.com/review/fixam.co.uk";

export default function Feedbacks() {
  const [response, setResponse] = useState<FeedbacksResponse | null>(null);
  const [hasError, setHasError] = useState(false);

  const load = useCallback(async (bustCache: boolean = false) => {
    try {
      setHasError(false);
      const url = bustCache
        ? `/api/feedbacks?limit=6&_=${Date.now()}`
        : "/api/feedbacks?limit=6";
      const res = await fetch(url, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to load feedbacks: ${res.status}`);
      const data = (await res.json()) as FeedbacksResponse;
      setResponse(data);
    } catch {
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handler = () => {
      load(true);
    };
    window.addEventListener("fixam-feedback-submitted", handler);
    return () => window.removeEventListener("fixam-feedback-submitted", handler);
  }, [load]);

  return (
    <section id="feedbacks" className="w-full py-12 md:py-16 bg-muted">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="tracking-tighter">What Our Clients Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from our satisfied customers about their experience with
              Fixam.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-6 min-[520px]:flex-row min-[520px]:justify-center">
          <ModalTrigger
            data-id={ModalIDs.Feedback}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Leave feedback
          </ModalTrigger>
          <a
            href={TRUSTPILOT_REVIEW_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read Trustpilot reviews
          </a>
        </div>

        {hasError ? (
          <div className="mx-auto max-w-3xl py-10 text-center">
            <p className="text-muted-foreground">
              Unable to load testimonials right now.
            </p>
          </div>
        ) : response ? (
          response.items.length > 0 ? (
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {response.items.map((feedback, index) => (
                <Feedback key={`${feedback.name}-${index}`} {...feedback} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-3xl py-10 text-center">
              <p className="text-muted-foreground">
                No testimonials yet — be the first to leave feedback.
              </p>
            </div>
          )
        ) : (
          <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border bg-background p-6 shadow-sm"
              >
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-4 h-5 w-full rounded bg-muted" />
                <div className="mt-2 h-5 w-5/6 rounded bg-muted" />
                <div className="mt-6 flex justify-end gap-3">
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-3 w-28 rounded bg-muted" />
                  </div>
                  <div className="h-12 w-12 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto max-w-5xl pb-2">
          <TrustpilotWidget />
        </div>
      </div>
    </section>
  );
}
