import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  onTimeUp?: () => void;
  maxMinutes?: number;
}

export const Timer = ({ onTimeUp, maxMinutes = 30 }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        const newSeconds = prev + 1;
        if (maxMinutes && newSeconds >= maxMinutes * 60) {
          onTimeUp?.();
          return newSeconds;
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxMinutes, onTimeUp]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isNearLimit = maxMinutes && seconds >= (maxMinutes - 5) * 60;

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-2 rounded-full glass text-sm font-medium",
      isNearLimit ? "text-red-500 animate-pulse" : "text-foreground"
    )}>
      <Clock className="h-4 w-4" />
      <span>{formatTime(seconds)}</span>
      {maxMinutes && (
        <span className="text-xs text-muted-foreground">
          / {maxMinutes}min
        </span>
      )}
    </div>
  );
};