import { cn } from "@/lib/utils";
import { DailyVideo, useVideoTrack } from "@daily-co/daily-react";

export default function Video({
  id,
  className,
  tileClassName,
}: {
  id: string;
  className?: string;
  tileClassName?: string;
}) {
  const videoState = useVideoTrack(id);

  return (
    <div
      className={cn("bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden", className, {
        "hidden size-0": videoState.isOff,
      })}
    >
      <DailyVideo
        automirror
        sessionId={id}
        type="video"
        className={cn("size-full object-cover", tileClassName, {
          hidden: videoState.isOff,
        })}
      />
    </div>
  );
}