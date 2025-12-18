import Image from "next/image";
import { Star } from "lucide-react";

type FeedbackProps = {
  avatar: string;
  name: string;
  position: string;
  feedback: string;
  rating?: number;
  source?: string;
};

export default function Feedback({
  avatar,
  name,
  position,
  feedback,
  rating,
  source,
}: FeedbackProps) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-md border border-primary/20 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between gap-3">
        {typeof rating === "number" ? (
          <div className="flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => {
              const active = i < rating;
              return (
                <Star
                  key={i}
                  className={`h-4 w-4 ${active ? "fill-yellow-400" : "text-muted-foreground"}`}
                />
              );
            })}
          </div>
        ) : (
          <span />
        )}
        {source ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {source}
          </span>
        ) : null}
      </div>

      <h3 className="text-muted-foreground">{feedback}</h3>
      <div className="flex items-center justify-end gap-4">
        <div>
          <p className="font-bold text-lg text-muted-foreground text-end">
            {name}
          </p>
          <p className="text-sm text-muted-foreground text-end">{position}</p>
        </div>
        <Image
          src={avatar}
          alt={`${name}'s avatar`}
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
