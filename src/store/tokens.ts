import { atom } from "jotai";

const getInitialToken = (): string | null => {
  // Use the provided API key as default
  const providedToken = "39b6de7eb0194fa696651b521a6c2ca4";
  const savedToken = localStorage.getItem('tavus-token');
  return savedToken || providedToken;
};

export const apiTokenAtom = atom<string | null>(getInitialToken());