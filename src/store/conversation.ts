import { atom } from "jotai";

export interface IConversation {
  conversation_id: string;
  conversation_name: string;
  status: string;
  conversation_url: string;
  created_at: string;
}

export const conversationAtom = atom<IConversation | null>(null);