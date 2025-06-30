import { atom } from "jotai";

const getInitialToken = (): string | null => {
  // Check for saved token in localStorage first
  const savedToken = localStorage.getItem('tavus-token');
  return savedToken || null;
};

// Clear any cached session data when token changes
export const apiTokenAtom = atom<string | null>(
  getInitialToken(),
  (get, set, newToken: string | null) => {
    // Clear any active session data when API token changes
    localStorage.removeItem('tavus-active-session');
    
    // Save new token
    if (newToken) {
      localStorage.setItem('tavus-token', newToken);
    } else {
      localStorage.removeItem('tavus-token');
    }
    
    return newToken;
  }
);