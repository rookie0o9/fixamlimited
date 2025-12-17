import Image from "next/image";

type FeedbackProps = {
  avatar: string;
  name: string;
  position: string;
  feedback: string;
};

export default function Feedback({
  avatar,
  name,
  position,
  feedback,
}: FeedbackProps) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-md border border-primary/20 flex flex-col justify-between gap-4">
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
