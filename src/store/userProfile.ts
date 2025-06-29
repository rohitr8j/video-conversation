import { atom } from "jotai";

export interface UserProfile {
  fullName: string;
  age: number | null;
  gender: string;
  preferredLanguage: string;
  therapyGoals: string;
}

const getInitialProfile = (): UserProfile => {
  const savedProfile = localStorage.getItem('user-profile');
  if (savedProfile) {
    return JSON.parse(savedProfile);
  }
  return {
    fullName: "",
    age: null,
    gender: "",
    preferredLanguage: "English",
    therapyGoals: "",
  };
};

export const userProfileAtom = atom<UserProfile>(getInitialProfile());