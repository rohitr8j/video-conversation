import { atom } from "jotai";

export type Screen =
  | "home"
  | "avatarSelector"
  | "topicSelector"
  | "videoChat"
  | "journal"
  | "thankYou"
  | "settings";

interface ScreenState {
  currentScreen: Screen;
}

const initialScreenState: ScreenState = {
  currentScreen: "home",
};

export const screenAtom = atom<ScreenState>(initialScreenState);