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
  specialty: string;
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

// Therapy topics data
export const therapyTopics: TherapyTopic[] = [
  {
    id: 'anxiety',
    name: 'Anxiety & Stress',
    description: 'Managing anxiety, stress, and overwhelming feelings',
    icon: '😰',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'depression',
    name: 'Depression & Mood',
    description: 'Working through depression, low mood, and emotional challenges',
    icon: '😔',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Improving communication and relationship dynamics',
    icon: '💕',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'trauma',
    name: 'Trauma & PTSD',
    description: 'Healing from traumatic experiences and PTSD',
    icon: '🛡️',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'career',
    name: 'Career & Work',
    description: 'Professional development and work-life balance',
    icon: '💼',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'self-esteem',
    name: 'Self-Esteem',
    description: 'Building confidence and self-worth',
    icon: '✨',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'life-transitions',
    name: 'Life Transitions',
    description: 'Navigating major life changes and transitions',
    icon: '🌟',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'grief',
    name: 'Grief & Loss',
    description: 'Processing grief, loss, and bereavement',
    icon: '🕊️',
    color: 'bg-gray-100 text-gray-800'
  }
];

// Therapist avatars with your actual persona IDs
export const therapists: Therapist[] = [
  {
    id: 'dr-sarah',
    name: 'Dr. Sarah',
    title: 'Licensed Clinical Psychologist',
    specialty: 'Anxiety & Depression',
    specialties: ['Anxiety Disorders', 'Depression', 'Cognitive Behavioral Therapy', 'Stress Management'],
    description: 'Warm and empathetic approach with expertise in anxiety and depression using evidence-based CBT techniques.',
    avatar: '👩‍⚕️',
    personaId: 'p2fbd605',
    experience: '10+ years',
    approach: 'Cognitive Behavioral Therapy (CBT)'
  },
  {
    id: 'dr-marcus',
    name: 'Dr. Marcus',
    title: 'Licensed Trauma Specialist',
    specialty: 'Trauma & EMDR',
    specialties: ['Trauma Therapy', 'EMDR', 'PTSD', 'Complex Trauma'],
    description: 'Specialized in trauma-informed care using EMDR and other evidence-based approaches for healing.',
    avatar: '👨‍⚕️',
    personaId: 'p9a95912',
    experience: '12+ years',
    approach: 'EMDR & Trauma-Informed Care'
  },
  {
    id: 'dr-elena',
    name: 'Dr. Elena Rodriguez',
    title: 'Licensed Marriage & Family Therapist',
    specialty: 'Relationships & Family',
    specialties: ['Couples Therapy', 'Family Therapy', 'Communication', 'Relationship Issues'],
    description: 'Expert in relationship dynamics and family systems with a compassionate, solution-focused approach.',
    avatar: '👩‍🏫',
    personaId: 'p3bb4745d4f9',
    experience: '8+ years',
    approach: 'Emotionally Focused Therapy (EFT)'
  },
  {
    id: 'dr-aisha',
    name: 'Dr. Aisha Patel',
    title: 'Holistic Wellness Therapist',
    specialty: 'Holistic Wellness',
    specialties: ['Holistic Therapy', 'Mind-Body Connection', 'Stress Management', 'Wellness Coaching'],
    description: 'Integrative approach combining traditional therapy with holistic wellness practices for complete healing.',
    avatar: '🧘‍♀️',
    personaId: 'p48fdf065d6b',
    experience: '7+ years',
    approach: 'Integrative Holistic Therapy'
  },
  {
    id: 'zen-master-kai',
    name: 'Zen Master Kai',
    title: 'Mindfulness & Meditation Guide',
    specialty: 'Mindfulness & Meditation',
    specialties: ['Mindfulness', 'Meditation', 'Stress Reduction', 'Inner Peace'],
    description: 'Ancient wisdom meets modern psychology. Guiding you to inner peace through mindfulness and meditation practices.',
    avatar: '🧘‍♂️',
    personaId: 'p5d11710002a',
    experience: '15+ years',
    approach: 'Mindfulness-Based Stress Reduction'
  },
  {
    id: 'coach-alex',
    name: 'Coach Alex',
    title: 'Peak Performance Coach',
    specialty: 'Peak Performance',
    specialties: ['Performance Coaching', 'Goal Achievement', 'Motivation', 'Success Mindset'],
    description: 'High-energy coaching focused on unlocking your potential and achieving peak performance in all areas.',
    avatar: '💪',
    personaId: 'pe13ed370726',
    experience: '6+ years',
    approach: 'Performance Psychology & Coaching'
  },
  {
    id: 'sophia-wisdom',
    name: 'Sophia Wisdom',
    title: 'Life Transition Specialist',
    specialty: 'Life Transitions',
    specialties: ['Life Transitions', 'Career Changes', 'Personal Growth', 'Identity Development'],
    description: 'Guiding individuals through major life changes with wisdom, support, and practical strategies.',
    avatar: '🌟',
    personaId: 'pdced222244b',
    experience: '9+ years',
    approach: 'Narrative Therapy & Life Coaching'
  }
];