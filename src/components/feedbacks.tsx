import { sheetsGetFeedbacks } from "@/actions/sheets";
import Feedback from "@/components/feedback";

export default async function Feedbacks() {
  const feedbacks = await sheetsGetFeedbacks();

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
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {feedbacks.map((feedback, index) => (
            <Feedback key={index} {...feedback} />
          ))}
        </div>
      </div>
    </section>
  );
}
