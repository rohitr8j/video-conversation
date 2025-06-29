import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { sessionDataAtom, journalEntryAtom } from "@/store/therapy";
import { Heart, Calendar, MessageCircle, Star } from "lucide-react";

export const ThankYou = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [sessionData] = useAtom(sessionDataAtom);
  const [journalEntry] = useAtom(journalEntryAtom);

  const handleNewSession = () => {
    // Reset session data
    setScreenState({ currentScreen: "avatarSelector" });
  };

  const handleGoHome = () => {
    setScreenState({ currentScreen: "home" });
  };

  const getMoodEmoji = (mood: number) => {
    const moodMap = {
      1: "😢",
      2: "😔", 
      3: "😐",
      4: "😊",
      5: "😄"
    };
    return moodMap[mood as keyof typeof moodMap] || "😐";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Thank You */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl mb-4"
        >
          🙏
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">
          Thank You for Taking Care of Yourself
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          You've taken an important step in your mental health journey. 
          Remember, seeking support is a sign of strength, not weakness.
        </p>
      </motion.div>

      {/* Session Recap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="glass border-2">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-3xl">{sessionData.therapist?.avatar}</div>
            <div>
              <h3 className="font-semibold text-lg">{sessionData.therapist?.name}</h3>
              <p className="text-sm text-muted-foreground">{sessionData.therapist?.title}</p>
            </div>
            <div className="flex items-center justify-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Thank you for the session!
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Topic Discussed</h3>
                <p className="text-sm text-muted-foreground">{sessionData.topic?.name}</p>
              </div>
            </div>
            
            {journalEntry && (
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getMoodEmoji(journalEntry.mood)}</div>
                <div>
                  <h3 className="font-semibold">Your Mood</h3>
                  <p className="text-sm text-muted-foreground">Recorded after session</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Session Date</h3>
                <p className="text-sm text-muted-foreground">
                  {sessionData.startTime?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Encouragement Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass border-2 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-semibold mb-2">Keep Growing</h3>
            <p className="text-sm text-muted-foreground">
              Every session is a step forward in your healing journey.
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-3">💪</div>
            <h3 className="font-semibold mb-2">You're Strong</h3>
            <p className="text-sm text-muted-foreground">
              Seeking help takes courage. You should be proud of yourself.
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-3">🤗</div>
            <h3 className="font-semibold mb-2">You're Not Alone</h3>
            <p className="text-sm text-muted-foreground">
              We're here whenever you need support and guidance.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={handleNewSession}
          variant="glow"
          size="lg"
          className="flex items-center space-x-2"
        >
          <Heart className="h-5 w-5" />
          <span>Book Another Session</span>
        </Button>
        <Button
          onClick={handleGoHome}
          variant="outline"
          size="lg"
        >
          Return Home
        </Button>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <Card className="glass border-2">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Need Immediate Support?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Crisis Text Line</p>
                <p className="text-muted-foreground">Text HOME to 741741</p>
              </div>
              <div>
                <p className="font-medium">National Suicide Prevention Lifeline</p>
                <p className="text-muted-foreground">988</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              If you're experiencing a mental health emergency, please contact emergency services or visit your nearest emergency room.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};