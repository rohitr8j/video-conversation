import { atom } from "jotai";

const getInitialToken = (): string | null => {
  const savedToken = localStorage.getItem('tavus-token');
  return savedToken || null;
};

export const apiTokenAtom = atom<string | null>(getInitialToken());