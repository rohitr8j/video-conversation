import { atom } from "jotai";

export interface Therapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  description: string;
  avatar: string;
  personaId: string;
  experience: string;
  approach: string;
}

export interface TherapyTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface JournalEntry {
  mood: number;
  entry: string;
  date: string;
}

export interface SessionData {
  therapist: Therapist | null;
  topic: TherapyTopic | null;
  startTime: Date | null;
  endTime: Date | null;
  duration: number;
}

// Atoms
export const selectedTherapistAtom = atom<Therapist | null>(null);
export const selectedTopicAtom = atom<TherapyTopic | null>(null);
export const sessionDataAtom = atom<SessionData>({
  therapist: null,
  topic: null,
  startTime: null,
  endTime: null,
  duration: 0,
});
export const journalEntryAtom = atom<JournalEntry | null>(null);

// Updated therapist data with actual Tavus persona IDs
export const therapists: Therapist[] = [
  {
    id: "sarah",
    name: "Dr. Sarah Chen",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Stress Management"],
    description: "Warm and empathetic approach with 10+ years of experience helping clients overcome anxiety and depression.",
    avatar: "👩‍⚕️",
    personaId: "", // REPLACE WITH YOUR ACTUAL TAVUS PERSONA ID
    experience: "10+ years",
    approach: "Cognitive Behavioral Therapy (CBT)"
  },
  {
    id: "marcus",
    name: "Dr. Marcus Johnson",
    title: "Licensed Marriage & Family Therapist",
    specialties: ["Relationships", "Family Therapy", "Communication"],
    description: "Specializes in relationship counseling and family dynamics with a solution-focused approach.",
    avatar: "👨‍⚕️",
    personaId: "", // REPLACE WITH YOUR ACTUAL TAVUS PERSONA ID
    experience: "8+ years",
    approach: "Solution-Focused Therapy"
  },
  {
    id: "elena",
    name: "Dr. Elena Rodriguez",
    title: "Licensed Trauma Specialist",
    specialties: ["Trauma", "PTSD", "Grief Counseling"],
    description: "Compassionate trauma-informed care helping clients heal from difficult life experiences.",
    avatar: "👩‍💼",
    personaId: "", // REPLACE WITH YOUR ACTUAL TAVUS PERSONA ID
    experience: "12+ years",
    approach: "EMDR & Trauma-Informed Care"
  },
  {
    id: "david",
    name: "Dr. David Kim",
    title: "Licensed Clinical Social Worker",
    specialties: ["Self-Esteem", "Life Transitions", "Mindfulness"],
    description: "Integrative approach combining mindfulness practices with traditional therapy techniques.",
    avatar: "👨‍💼",
    personaId: "", // REPLACE WITH YOUR ACTUAL TAVUS PERSONA ID
    experience: "6+ years",
    approach: "Mindfulness-Based Therapy"
  }
];

export const therapyTopics: TherapyTopic[] = [
  {
    id: "anxiety",
    name: "Anxiety & Worry",
    description: "Managing overwhelming thoughts and anxious feelings",
    icon: "🌊",
    color: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
  },
  {
    id: "depression",
    name: "Depression & Mood",
    description: "Working through sadness, low mood, and lack of motivation",
    icon: "🌱",
    color: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
  },
  {
    id: "stress",
    name: "Stress Management",
    description: "Coping with work, life, and daily pressures",
    icon: "⚡",
    color: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700"
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Improving communication and connection with others",
    icon: "💝",
    color: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700"
  },
  {
    id: "trauma",
    name: "Trauma & Healing",
    description: "Processing difficult experiences and finding healing",
    icon: "🕊️",
    color: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
  },
  {
    id: "self-esteem",
    name: "Self-Esteem",
    description: "Building confidence and self-worth",
    icon: "✨",
    color: "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700"
  },
  {
    id: "grief",
    name: "Grief & Loss",
    description: "Navigating loss and the grieving process",
    icon: "🤗",
    color: "bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700"
  },
  {
    id: "life-transitions",
    name: "Life Transitions",
    description: "Adapting to major life changes and new chapters",
    icon: "🦋",
    color: "bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700"
  }
];