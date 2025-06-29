import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { selectedTherapistAtom, selectedTopicAtom, therapyTopics } from "@/store/therapy";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const TopicSelector = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [selectedTherapist] = useAtom(selectedTherapistAtom);
  const [selectedTopic, setSelectedTopic] = useAtom(selectedTopicAtom);

  const handleBack = () => {
    setScreenState({ currentScreen: "avatarSelector" });
  };

  const handleSelectTopic = (topic: typeof therapyTopics[0]) => {
    setSelectedTopic(topic);
    setScreenState({ currentScreen: "videoChat" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">What would you like to talk about?</h1>
          <p className="text-muted-foreground mt-2">
            {selectedTherapist && (
              <>You'll be speaking with <span className="font-medium">{selectedTherapist.name}</span></>
            )}
          </p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </motion.div>

      {/* Selected Therapist Preview */}
      {selectedTherapist && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <Card className="glass border-2 border-primary/30">
            <CardContent className="flex items-center space-x-4 p-4">
              <div className="text-3xl">{selectedTherapist.avatar}</div>
              <div>
                <h3 className="font-semibold">{selectedTherapist.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedTherapist.title}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {therapyTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
                topic.color,
                selectedTopic?.id === topic.id 
                  ? 'ring-2 ring-primary scale-105' 
                  : 'hover:border-primary/50'
              )}
              onClick={() => handleSelectTopic(topic)}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="text-4xl mb-2">{topic.icon}</div>
                <h3 className="font-semibold text-lg">{topic.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {topic.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTopic(topic);
                  }}
                >
                  Select This Topic
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="glass rounded-lg p-4 border">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Don't worry about choosing the "perfect" topic. 
            Your therapist will guide the conversation naturally based on what you need to discuss.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Your conversation will be private and confidential. You can discuss anything that's on your mind.
        </p>
      </motion.div>
    </div>
  );
};