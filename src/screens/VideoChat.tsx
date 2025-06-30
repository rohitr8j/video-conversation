import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAtom, useAtomValue } from "jotai";
import { screenAtom } from "@/store/screens";
import { selectedTherapistAtom, selectedTopicAtom, sessionDataAtom } from "@/store/therapy";
import { conversationAtom } from "@/store/conversation";
import { apiTokenAtom } from "@/store/tokens";
import { 
  sessionStateAtom, 
  hasActiveSessionAtom, 
  canCreateNewSessionAtom,
  startSessionCreationAtom,
  setActiveSessionAtom,
  endActiveSessionAtom,
  incrementRetryCountAtom,
  resetSessionCreationAtom
} from "@/store/session";
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
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  Clock,
  Users,
  CreditCard
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
  const [sessionState, setSessionState] = useAtom(sessionStateAtom);
  const [, startSessionCreation] = useAtom(startSessionCreationAtom);
  const [, setActiveSession] = useAtom(setActiveSessionAtom);
  const [, endActiveSession] = useAtom(endActiveSessionAtom);
  const [, incrementRetryCount] = useAtom(incrementRetryCountAtom);
  const [, resetSessionCreation] = useAtom(resetSessionCreationAtom);
  
  const token = useAtomValue(apiTokenAtom);
  const hasActiveSession = useAtomValue(hasActiveSessionAtom);
  const canCreateNewSession = useAtomValue(canCreateNewSessionAtom);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [retryTimeLeft, setRetryTimeLeft] = useState<number>(0);
  
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });

  // Validate persona ID helper
  const validatePersonaId = (personaId: string): boolean => {
    return personaId && !personaId.startsWith('REPLACE_WITH_YOUR_PERSONA_ID') && !personaId.includes('REPLACE');
  };

  // Check for concurrent error
  const isConcurrentError = (errorMessage: string): boolean => {
    return errorMessage.toLowerCase().includes('maximum concurrent conversations') || 
           errorMessage.toLowerCase().includes('concurrent conversations') ||
           errorMessage.toLowerCase().includes('reached maximum');
  };

  // Check for credits error
  const isCreditsError = (errorMessage: string): boolean => {
    return errorMessage.toLowerCase().includes('credits') || 
           errorMessage.toLowerCase().includes('payment required') ||
           errorMessage.toLowerCase().includes('402');
  };

  // Retry with exponential backoff
  const scheduleRetry = useCallback((retryCount: number) => {
    const baseDelay = 5000; // 5 seconds
    const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
    const maxDelay = 30000; // Max 30 seconds
    const actualDelay = Math.min(delay, maxDelay);
    
    setRetryTimeLeft(Math.ceil(actualDelay / 1000));
    
    const interval = setInterval(() => {
      setRetryTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimeout(() => {
      clearInterval(interval);
      setRetryTimeLeft(0);
      initializeConversation(true); // Retry
    }, actualDelay);
  }, []);

  // Initialize conversation with session management
  const initializeConversation = useCallback(async (isRetry = false) => {
    if (!selectedTherapist) {
      setError("No therapist selected. Please go back and select a therapist.");
      return;
    }

    if (!token) {
      setError("Missing Tavus API Token: Please configure your Tavus API token in Settings to start a therapy session.");
      return;
    }

    // Validate persona ID
    if (!validatePersonaId(selectedTherapist.personaId)) {
      setError(`Missing Tavus Persona ID – Please update this therapist in the code. The therapist "${selectedTherapist.name}" has an invalid persona ID: "${selectedTherapist.personaId}". Update src/store/therapy.ts with your actual persona ID from https://platform.tavus.io`);
      return;
    }

    // Check if we can create a new session
    if (!isRetry && !canCreateNewSession) {
      if (hasActiveSession) {
        setError("You already have an active session. Please end your current session before starting a new one.");
        return;
      }
      
      if (sessionState.isCreatingSession) {
        setError("A session is already being created. Please wait...");
        return;
      }
      
      const timeSinceLastEnd = sessionState.lastSessionEndTime 
        ? Date.now() - sessionState.lastSessionEndTime.getTime()
        : Infinity;
      
      if (timeSinceLastEnd < 30000) {
        const waitTime = Math.ceil((30000 - timeSinceLastEnd) / 1000);
        setError(`Please wait ${waitTime} seconds before starting a new session.`);
        setTimeout(() => initializeConversation(), waitTime * 1000);
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo(null);
      
      // Start session creation
      if (!isRetry) {
        startSessionCreation({ 
          personaId: selectedTherapist.personaId, 
          therapistName: selectedTherapist.name 
        });
      }
      
      // Create custom greeting based on selected topic
      const topicGreeting = selectedTopic 
        ? `Hello! I'm ${selectedTherapist.name}, and I'm here to help you with ${selectedTopic.name.toLowerCase()}. I understand you'd like to talk about ${selectedTopic.description.toLowerCase()}. This is a safe space for you to share whatever is on your mind. How are you feeling today?`
        : `Hello! I'm ${selectedTherapist.name}. I'm here to provide you with a safe, supportive space to talk about whatever is on your mind. How are you feeling today?`;
      
      const context = `You are ${selectedTherapist.name}, a ${selectedTherapist.title} specializing in ${selectedTherapist.specialties.join(', ')}. Your approach is ${selectedTherapist.approach}. ${selectedTopic ? `The client wants to discuss ${selectedTopic.name}: ${selectedTopic.description}.` : ''} Provide compassionate, professional therapy while maintaining appropriate boundaries. Listen actively, ask thoughtful questions, and offer evidence-based guidance.`;
      
      // Store debug info for error display
      setDebugInfo({
        therapistName: selectedTherapist.name,
        personaId: selectedTherapist.personaId,
        topicName: selectedTopic?.name,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 8) + '...',
        retryCount: sessionState.retryCount,
        hasActiveSession,
        canCreateNew: canCreateNewSession
      });

      const newConversation = await createConversation(
        token,
        selectedTherapist.personaId,
        topicGreeting,
        context
      );
      
      // Set active session
      setActiveSession({
        conversationId: newConversation.conversation_id,
        personaId: selectedTherapist.personaId,
        therapistName: selectedTherapist.name,
        startTime: new Date(),
        status: 'active'
      });
      
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
        const errorMessage = err.message;
        
        // Handle credits errors - don't retry these
        if (isCreditsError(errorMessage)) {
          setError(errorMessage);
          resetSessionCreation();
          return;
        }
        
        // Handle concurrent conversation errors with retry
        if (isConcurrentError(errorMessage) && sessionState.retryCount < sessionState.maxRetries) {
          incrementRetryCount();
          scheduleRetry(sessionState.retryCount);
          setError(`Maximum concurrent conversations reached. Retrying in a few seconds... (Attempt ${sessionState.retryCount + 1}/${sessionState.maxRetries})`);
          return;
        }
        
        setError(errorMessage);
        resetSessionCreation();
      } else {
        setError("Unknown Error: Failed to start session. Please try again.");
        resetSessionCreation();
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedTherapist, 
    selectedTopic, 
    token, 
    canCreateNewSession, 
    hasActiveSession, 
    sessionState,
    startSessionCreation,
    setActiveSession,
    incrementRetryCount,
    resetSessionCreation,
    scheduleRetry
  ]);

  // Initialize conversation on mount
  useEffect(() => {
    initializeConversation();
  }, [initializeConversation]);

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
    
    // End active session
    endActiveSession(conversation?.conversation_id);
    setConversation(null);
    
    // Update session data
    setSessionData(prev => ({
      ...prev,
      endTime: new Date(),
      duration: prev.startTime ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000) : 0
    }));
    
    setScreenState({ currentScreen: "journal" });
  }, [daily, conversation, token, endActiveSession, setSessionData, setScreenState]);

  const handleTimeUp = useCallback(() => {
    handleEndSession();
  }, [handleEndSession]);

  const handleGoToSettings = () => {
    setScreenState({ currentScreen: "settings" });
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setConversation(null);
    resetSessionCreation();
    initializeConversation();
  };

  const handleBackToTherapists = () => {
    // Clean up any pending session creation
    resetSessionCreation();
    setScreenState({ currentScreen: "avatarSelector" });
  };

  const handleBackToTopics = () => {
    resetSessionCreation();
    setScreenState({ currentScreen: "topicSelector" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (error) {
    const isTokenError = error.includes("API token") || error.includes("Authentication") || error.includes("Unauthorized") || error.includes("401");
    const isPersonaError = error.includes("Persona ID") || error.includes("persona ID") || error.includes("Invalid Persona") || error.includes("400") || error.includes("404");
    const isCreditsErrorDetected = isCreditsError(error);
    const isNetworkError = error.includes("Network") || error.includes("network");
    const isRateLimitError = error.includes("Rate") || error.includes("429");
    const isConcurrentErrorDetected = isConcurrentError(error);
    const isRetryInProgress = retryTimeLeft > 0;
    
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <Card className="glass border-2 border-red-200 dark:border-red-800 p-8">
          <div className="text-4xl mb-4">
            {isRetryInProgress ? (
              <Clock className="h-16 w-16 text-yellow-500 mx-auto animate-spin" />
            ) : isCreditsErrorDetected ? (
              <CreditCard className="h-16 w-16 text-orange-500 mx-auto" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
            {isRetryInProgress ? (
              <span className="text-yellow-600 dark:text-yellow-400">
                Retrying in {retryTimeLeft} seconds...
              </span>
            ) : isCreditsErrorDetected ? (
              <span className="text-orange-600 dark:text-orange-400">Account Credits Required</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Session Error</span>
            )}
          </h2>
          
          <div className="text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border mb-6">
            <p className="text-muted-foreground leading-relaxed font-mono text-sm">
              {error}
            </p>
          </div>
          
          {/* Debug Information */}
          {debugInfo && (
            <div className="bg-gray-50 dark:bg-gray-900/20 border rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-3 text-left">Debug Information:</h3>
              <div className="text-left space-y-2 text-sm font-mono">
                <div className="flex justify-between items-center">
                  <span>Therapist:</span>
                  <span>{debugInfo.therapistName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Persona ID:</span>
                  <div className="flex items-center space-x-2">
                    <span>{debugInfo.personaId}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(debugInfo.personaId)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {debugInfo.topicName && (
                  <div className="flex justify-between items-center">
                    <span>Topic:</span>
                    <span>{debugInfo.topicName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>API Token:</span>
                  <span>{debugInfo.tokenPrefix} (length: {debugInfo.tokenLength})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Retry Count:</span>
                  <span>{debugInfo.retryCount}/{sessionState.maxRetries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Has Active Session:</span>
                  <span>{debugInfo.hasActiveSession ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Solution Guide */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-3 flex items-center justify-center space-x-2">
                <span>💡</span>
                <span>How to Fix This:</span>
              </p>
              
              {isCreditsErrorDetected && (
                <div className="text-left space-y-2">
                  <p className="font-medium flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Account Credits Required (402 Error):</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Your Tavus account is out of conversational credits</li>
                    <li>Visit <a href="https://platform.tavus.io/billing" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center space-x-1">
                      <span>platform.tavus.io/billing</span>
                      <ExternalLink className="h-3 w-3" />
                    </a> to check your account balance</li>
                    <li>Add more credits to your account or upgrade your plan</li>
                    <li>Once credits are added, you can start a new session</li>
                    <li>Consider setting up auto-recharge to avoid interruptions</li>
                  </ol>
                </div>
              )}
              
              {isConcurrentErrorDetected && (
                <div className="text-left space-y-2">
                  <p className="font-medium flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Maximum Concurrent Conversations (400 Error):</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>You have reached the maximum number of active conversations</li>
                    <li>Visit <a href="https://platform.tavus.io/conversations" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center space-x-1">
                      <span>platform.tavus.io/conversations</span>
                      <ExternalLink className="h-3 w-3" />
                    </a> to view active sessions</li>
                    <li>End any existing conversations that are no longer needed</li>
                    <li>Wait for current conversations to naturally end</li>
                    <li>The system will automatically retry with exponential backoff</li>
                    <li>Consider upgrading your plan for higher concurrent limits</li>
                  </ol>
                </div>
              )}
              
              {isPersonaError && !isConcurrentErrorDetected && !isCreditsErrorDetected && (
                <div className="text-left space-y-2">
                  <p className="font-medium">Persona ID Issue (400/404 Error):</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Visit <a href="https://platform.tavus.io/personas" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center space-x-1">
                      <span>platform.tavus.io/personas</span>
                      <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>Find or create a persona for {selectedTherapist?.name}</li>
                    <li>Copy the correct persona ID</li>
                    <li>Update the personaId in src/store/therapy.ts</li>
                    <li>Ensure your API token has access to this persona</li>
                  </ol>
                </div>
              )}
              
              {isTokenError && (
                <div className="text-left space-y-2">
                  <p className="font-medium">API Token Issue (401 Error):</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Go to Settings and verify your API token</li>
                    <li>Visit <a href="https://platform.tavus.io/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center space-x-1">
                      <span>platform.tavus.io/api-keys</span>
                      <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>Generate a new API key if needed</li>
                    <li>Ensure the token has conversation creation permissions</li>
                  </ol>
                </div>
              )}
              
              {isRateLimitError && (
                <div className="text-left space-y-2">
                  <p className="font-medium">Rate Limit Issue (429 Error):</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Wait a few minutes before trying again</li>
                    <li>Check your API usage limits in the Tavus platform</li>
                    <li>Consider upgrading your plan for higher limits</li>
                  </ol>
                </div>
              )}
              
              {isNetworkError && (
                <div className="text-left space-y-2">
                  <p className="font-medium">Network Issue:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page</li>
                    <li>Check if Tavus services are operational</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {isCreditsErrorDetected && (
              <Button 
                onClick={() => window.open('https://platform.tavus.io/billing', '_blank')} 
                className="flex items-center space-x-2" 
                variant="glow"
              >
                <CreditCard className="h-4 w-4" />
                <span>Add Credits</span>
              </Button>
            )}
            
            {isTokenError && (
              <Button onClick={handleGoToSettings} className="flex items-center space-x-2" variant="glow">
                <Settings className="h-4 w-4" />
                <span>Fix in Settings</span>
              </Button>
            )}
            
            {!isNetworkError && !isRetryInProgress && !isCreditsErrorDetected && (
              <Button onClick={handleRetry} className="flex items-center space-x-2" variant="outline">
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
            )}
            
            <Button onClick={handleBackToTherapists} variant="outline">
              Choose Different Therapist
            </Button>
            
            {selectedTopic && (
              <Button onClick={handleBackToTopics} variant="outline">
                Change Topic
              </Button>
            )}
            
            <Button 
              onClick={() => window.open('https://platform.tavus.io', '_blank')} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Tavus Platform</span>
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
              {selectedTopic && (
                <p className="text-sm text-muted-foreground mt-2">
                  Topic: {selectedTopic.name}
                </p>
              )}
              {sessionState.isCreatingSession && (
                <p className="text-xs text-muted-foreground mt-2">
                  Creating secure conversation...
                </p>
              )}
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
              {selectedTopic ? `${selectedTopic.name} Session` : 'Therapy Session'}
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
            {selectedTopic && (
              <div className="absolute top-4 left-4">
                <div className="glass rounded-lg px-3 py-2 flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{selectedTopic.name}</span>
                </div>
              </div>
            )}
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