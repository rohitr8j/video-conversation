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

  if (!videoState || videoState.isOff) {
    return (
      <div className={cn("bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center", className)}>
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">📹</div>
          <p className="text-sm">Video is off</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden", className)}>
      <DailyVideo
        automirror
        sessionId={id}
        type="video"
        className={cn("size-full object-cover", tileClassName)}
      />
    </div>
  );
}