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
    try {
      return JSON.parse(savedProfile);
    } catch {
      // If parsing fails, return default
    }
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

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('user-profile', JSON.stringify(profile));
};