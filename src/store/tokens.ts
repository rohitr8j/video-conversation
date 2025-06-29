import { atom } from "jotai";

const getInitialToken = (): string | null => {
  // Check for saved token in localStorage first
  const savedToken = localStorage.getItem('tavus-token');
  return savedToken || null; // Remove the hardcoded invalid token
};

export const apiTokenAtom = atom<string | null>(getInitialToken());