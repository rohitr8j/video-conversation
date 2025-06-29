import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { journalEntryAtom, sessionDataAtom } from "@/store/therapy";
import { useState } from "react";
import { cn } from "@/lib/utils";

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Very Sad", color: "text-red-500" },
  { value: 2, emoji: "😔", label: "Sad", color: "text-orange-500" },
  { value: 3, emoji: "😐", label: "Neutral", color: "text-yellow-500" },
  { value: 4, emoji: "😊", label: "Happy", color: "text-green-500" },
  { value: 5, emoji: "😄", label: "Very Happy", color: "text-blue-500" },
];

export const Journal = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [sessionData] = useAtom(sessionDataAtom);
  const [journalEntry, setJournalEntry] = useAtom(journalEntryAtom);
  
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [entryText, setEntryText] = useState("");

  const handleSaveAndContinue = () => {
    if (selectedMood) {
      setJournalEntry({
        mood: selectedMood,
        entry: entryText,
        date: new Date().toISOString(),
      });
    }
    setScreenState({ currentScreen: "thankYou" });
  };

  const handleSkip = () => {
    setScreenState({ currentScreen: "thankYou" });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-4xl mb-4">📝</div>
        <h1 className="text-3xl font-bold gradient-text">How are you feeling?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to reflect on your session and capture your thoughts. 
          This journal entry is private and just for you.
        </p>
      </motion.div>

      {/* Session Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Session Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">{sessionData.therapist?.avatar}</div>
              <p className="font-medium">{sessionData.therapist?.name}</p>
              <p className="text-sm text-muted-foreground">{sessionData.therapist?.title}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">{sessionData.topic?.icon}</div>
              <p className="font-medium">{sessionData.topic?.name}</p>
              <p className="text-sm text-muted-foreground">{sessionData.topic?.description}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="font-medium">
                {sessionData.duration ? formatDuration(sessionData.duration) : "Session completed"}
              </p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle>Rate Your Current Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              {moodEmojis.map((mood) => (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.value)}
                  className={cn(
                    "flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-200",
                    selectedMood === mood.value
                      ? "bg-primary/20 border-2 border-primary scale-110"
                      : "hover:bg-muted border-2 border-transparent"
                  )}
                >
                  <span className="text-4xl">{mood.emoji}</span>
                  <span className={cn("text-sm font-medium", mood.color)}>
                    {mood.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Journal Entry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle>Journal Entry (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How did the session make you feel? What insights did you gain? What would you like to remember from today's conversation?"
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This journal entry is private and stored locally on your device.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={handleSaveAndContinue}
          variant="glow"
          size="lg"
          disabled={!selectedMood}
          className="flex-1 sm:flex-none"
        >
          Save & Continue
        </Button>
        <Button
          onClick={handleSkip}
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-none"
        >
          Skip for Now
        </Button>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Card className="glass border-2 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="text-2xl mb-2">🌱</div>
            <p className="text-sm text-muted-foreground">
              Remember, healing is a journey. Every step you take, including this session, 
              is progress toward better mental health and well-being.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};