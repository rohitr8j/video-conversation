import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAtom, useAtomValue } from "jotai";
import { screenAtom } from "@/store/screens";
import { selectedTherapistAtom, selectedTopicAtom, sessionDataAtom } from "@/store/therapy";
import { conversationAtom } from "@/store/conversation";
import { apiTokenAtom } from "@/store/tokens";
import { createConversation } from "@/api/createConversation";
import { endConversation } from "@/api/endConversation";
import { Timer } from "@/components/Timer";
import Video from "@/components/Video";
import { 
  useDaily, 
  useLocalSessionId, 
  useParticipantIds, 
  useVideoTrack, 
  useAudioTrack,
  DailyAudio 
} from "@daily-co/daily-react";
import { 
  MicIcon, 
  MicOffIcon, 
  VideoIcon, 
  VideoOffIcon, 
  PhoneIcon,
  MessageCircle,
  Settings,
  AlertTriangle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { quantum } from 'ldrs';

quantum.register();

export const VideoChat = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [selectedTherapist] = useAtom(selectedTherapistAtom);
  const [selectedTopic] = useAtom(selectedTopicAtom);
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [sessionData, setSessionData] = useAtom(sessionDataAtom);
  const token = useAtomValue(apiTokenAtom);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });

  // Initialize conversation
  useEffect(() => {
    const initializeConversation = async () => {
      if (!selectedTherapist || !selectedTopic) {
        setError("Missing required information");
        return;
      }

      if (!token) {
        setError("API token is required. Please configure your Tavus API token in Settings.");
        return;
      }

      try {
        setIsLoading(true);
        
        const customGreeting = `Hello! I'm ${selectedTherapist.name}, and I'm here to help you with ${selectedTopic.name.toLowerCase()}. I understand you'd like to talk about ${selectedTopic.description.toLowerCase()}. This is a safe space for you to share whatever is on your mind. How are you feeling today?`;
        
        const context = `You are ${selectedTherapist.name}, a ${selectedTherapist.title} specializing in ${selectedTherapist.specialties.join(', ')}. Your approach is ${selectedTherapist.approach}. The client wants to discuss ${selectedTopic.name}: ${selectedTopic.description}. Provide compassionate, professional therapy while maintaining appropriate boundaries. Listen actively, ask thoughtful questions, and offer evidence-based guidance.`;

        const newConversation = await createConversation(
          token,
          selectedTherapist.personaId,
          customGreeting,
          context
        );
        
        setConversation(newConversation);
        setSessionData({
          therapist: selectedTherapist,
          topic: selectedTopic,
          startTime: new Date(),
          endTime: null,
          duration: 0
        });
        
      } catch (err) {
        console.error("Failed to create conversation:", err);
        if (err instanceof Error) {
          if (err.message.includes('400')) {
            setError("Bad request: Please verify your Tavus API token is valid and that the selected therapist's persona ID is accessible with your account. The request parameters may be incorrect or your account may not have access to this persona.");
          } else if (err.message.includes('402')) {
            setError("Your Tavus API token is invalid, expired, or has insufficient credits. Please check your API token in Settings and ensure your Tavus account has available credits.");
          } else if (err.message.includes('401')) {
            setError("Authentication failed. Please verify your Tavus API token in Settings.");
          } else if (err.message.includes('403')) {
            setError("Access denied. Please check your API token permissions in the Tavus platform.");
          } else if (err.message.includes('429')) {
            setError("Rate limit exceeded. Please wait a moment and try again.");
          } else if (err.message.includes('500')) {
            setError("Tavus service is temporarily unavailable. Please try again in a few minutes.");
          } else {
            setError(`Failed to start session: ${err.message}`);
          }
        } else {
          setError("Failed to start session. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeConversation();
  }, [selectedTherapist, selectedTopic, token]);

  // Join Daily call when conversation is ready
  useEffect(() => {
    if (conversation?.conversation_url && daily) {
      daily.join({
        url: conversation.conversation_url,
        startVideoOff: false,
        startAudioOff: true,
      }).then(() => {
        daily.setLocalVideo(true);
        daily.setLocalAudio(false);
      });
    }
  }, [conversation?.conversation_url, daily]);

  // Enable audio when remote participant joins
  useEffect(() => {
    if (remoteParticipantIds.length > 0) {
      setTimeout(() => daily?.setLocalAudio(true), 2000);
    }
  }, [remoteParticipantIds, daily]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const handleEndSession = useCallback(async () => {
    if (conversation?.conversation_id && token) {
      try {
        await endConversation(token, conversation.conversation_id);
      } catch (error) {
        console.error("Failed to end conversation:", error);
      }
    }
    
    daily?.leave();
    daily?.destroy();
    setConversation(null);
    
    // Update session data
    setSessionData(prev => ({
      ...prev,
      endTime: new Date(),
      duration: prev.startTime ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000) : 0
    }));
    
    setScreenState({ currentScreen: "journal" });
  }, [daily, conversation, token, setSessionData, setScreenState]);

  const handleTimeUp = useCallback(() => {
    handleEndSession();
  }, [handleEndSession]);

  const handleGoToSettings = () => {
    setScreenState({ currentScreen: "settings" });
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Re-trigger the initialization by updating the effect dependencies
    window.location.reload();
  };

  if (error) {
    const isTokenError = error.includes("API token") || error.includes("Authentication") || error.includes("invalid") || error.includes("expired") || error.includes("credits") || error.includes("Bad request");
    
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card className="glass border-2 border-red-200 p-8">
          <div className="text-4xl mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Session Error</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">{error}</p>
          
          {isTokenError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-2">💡 Quick Fix:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Go to Settings and check your API token</li>
                  <li>Visit <a href="https://platform.tavus.io" target="_blank" rel="noopener noreferrer" className="underline">platform.tavus.io</a> to verify your account</li>
                  <li>Ensure your account has sufficient credits</li>
                  <li>Generate a new API key if needed</li>
                </ol>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            {isTokenError ? (
              <Button onClick={handleGoToSettings} className="flex items-center space-x-2" variant="glow">
                <Settings className="h-4 w-4" />
                <span>Go to Settings</span>
              </Button>
            ) : (
              <Button onClick={handleRetry} variant="glow">
                Try Again
              </Button>
            )}
            <Button 
              onClick={() => setScreenState({ currentScreen: "topicSelector" })} 
              variant="outline"
            >
              Back to Topics
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading || !conversation) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card className="glass border-2 p-12">
          <div className="space-y-6">
            <l-quantum size="60" speed="1.5" color="rgb(59 130 246)"></l-quantum>
            <div>
              <h2 className="text-2xl font-bold mb-2">Preparing Your Session</h2>
              <p className="text-muted-foreground">
                Connecting you with {selectedTherapist?.name}...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Session Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="text-2xl">{selectedTherapist?.avatar}</div>
          <div>
            <h2 className="text-lg font-semibold">{selectedTherapist?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedTopic?.name} Session
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Timer onTimeUp={handleTimeUp} maxMinutes={30} />
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Session</span>
          </div>
        </div>
      </motion.div>

      {/* Video Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Card className="overflow-hidden border-2 glass">
          <div className="aspect-video bg-gray-900 relative">
            {remoteParticipantIds.length > 0 ? (
              <Video
                id={remoteParticipantIds[0]}
                className="w-full h-full"
                tileClassName="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <l-quantum size="45" speed="1.75" color="white"></l-quantum>
                  <p className="text-white">Connecting to your therapist...</p>
                </div>
              </div>
            )}
            
            {/* Local Video */}
            {localSessionId && (
              <div className="absolute bottom-4 right-4">
                <Video
                  id={localSessionId}
                  className={cn(
                    "w-32 h-24 rounded-lg border-2 border-white/20 shadow-lg overflow-hidden",
                    !isCameraEnabled && "hidden"
                  )}
                  tileClassName="object-cover"
                />
              </div>
            )}
            
            {/* Topic Reminder */}
            <div className="absolute top-4 left-4">
              <div className="glass rounded-lg px-3 py-2 flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedTopic?.name}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 glass rounded-full px-6 py-3">
            <Button
              size="icon"
              variant={isMicEnabled ? "default" : "destructive"}
              onClick={toggleAudio}
              className="rounded-full"
            >
              {isMicEnabled ? (
                <MicIcon className="h-5 w-5" />
              ) : (
                <MicOffIcon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              size="icon"
              variant={isCameraEnabled ? "default" : "secondary"}
              onClick={toggleVideo}
              className="rounded-full"
            >
              {isCameraEnabled ? (
                <VideoIcon className="h-5 w-5" />
              ) : (
                <VideoOffIcon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              size="icon"
              variant="destructive"
              onClick={handleEndSession}
              className="rounded-full bg-red-500 hover:bg-red-600"
            >
              <PhoneIcon className="h-5 w-5 rotate-[135deg]" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Session Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>
          This is a safe, confidential space. Your therapist is here to listen and support you.
          Feel free to share whatever is on your mind.
        </p>
      </motion.div>

      <DailyAudio />
    </div>
  );
};