import { atom } from "jotai";

export interface ActiveSession {
  conversationId: string;
  personaId: string;
  therapistName: string;
  startTime: Date;
  status: 'initializing' | 'active' | 'ending' | 'ended';
}

export interface SessionState {
  currentSession: ActiveSession | null;
  isCreatingSession: boolean;
  lastSessionEndTime: Date | null;
  retryCount: number;
  maxRetries: number;
}

const getInitialSessionState = (): SessionState => {
  // Check localStorage for any persisted session data
  const savedSession = localStorage.getItem('tavus-active-session');
  let currentSession = null;
  
  if (savedSession) {
    try {
      const parsed = JSON.parse(savedSession);
      // Only restore if session is less than 1 hour old
      const sessionAge = Date.now() - new Date(parsed.startTime).getTime();
      if (sessionAge < 60 * 60 * 1000) { // 1 hour
        currentSession = {
          ...parsed,
          startTime: new Date(parsed.startTime)
        };
      } else {
        // Clean up old session data
        localStorage.removeItem('tavus-active-session');
      }
    } catch (error) {
      console.warn('Failed to parse saved session:', error);
      localStorage.removeItem('tavus-active-session');
    }
  }

  return {
    currentSession,
    isCreatingSession: false,
    lastSessionEndTime: null,
    retryCount: 0,
    maxRetries: 3
  };
};

export const sessionStateAtom = atom<SessionState>(getInitialSessionState());

// Helper atoms for derived state
export const hasActiveSessionAtom = atom((get) => {
  const sessionState = get(sessionStateAtom);
  return sessionState.currentSession !== null && 
         sessionState.currentSession.status !== 'ended';
});

export const canCreateNewSessionAtom = atom((get) => {
  const sessionState = get(sessionStateAtom);
  const hasActive = get(hasActiveSessionAtom);
  
  // Can't create if already creating or has active session
  if (sessionState.isCreatingSession || hasActive) {
    return false;
  }
  
  // Enforce minimum wait time between sessions (30 seconds)
  if (sessionState.lastSessionEndTime) {
    const timeSinceLastEnd = Date.now() - sessionState.lastSessionEndTime.getTime();
    return timeSinceLastEnd > 30 * 1000; // 30 seconds
  }
  
  return true;
});

// Actions
export const startSessionCreationAtom = atom(
  null,
  (get, set, { personaId, therapistName }: { personaId: string; therapistName: string }) => {
    const currentState = get(sessionStateAtom);
    
    set(sessionStateAtom, {
      ...currentState,
      isCreatingSession: true,
      retryCount: 0
    });
  }
);

export const setActiveSessionAtom = atom(
  null,
  (get, set, session: ActiveSession) => {
    const currentState = get(sessionStateAtom);
    
    // Persist to localStorage
    localStorage.setItem('tavus-active-session', JSON.stringify({
      ...session,
      startTime: session.startTime.toISOString()
    }));
    
    set(sessionStateAtom, {
      ...currentState,
      currentSession: session,
      isCreatingSession: false,
      retryCount: 0
    });
  }
);

export const endActiveSessionAtom = atom(
  null,
  (get, set, conversationId?: string) => {
    const currentState = get(sessionStateAtom);
    
    // Only end if conversation IDs match (or no ID provided for force end)
    if (!conversationId || currentState.currentSession?.conversationId === conversationId) {
      // Clean up localStorage
      localStorage.removeItem('tavus-active-session');
      
      set(sessionStateAtom, {
        ...currentState,
        currentSession: null,
        isCreatingSession: false,
        lastSessionEndTime: new Date(),
        retryCount: 0
      });
    }
  }
);

export const incrementRetryCountAtom = atom(
  null,
  (get, set) => {
    const currentState = get(sessionStateAtom);
    
    set(sessionStateAtom, {
      ...currentState,
      retryCount: currentState.retryCount + 1,
      isCreatingSession: false
    });
  }
);

export const resetSessionCreationAtom = atom(
  null,
  (get, set) => {
    const currentState = get(sessionStateAtom);
    
    set(sessionStateAtom, {
      ...currentState,
      isCreatingSession: false,
      retryCount: 0
    });
  }
);