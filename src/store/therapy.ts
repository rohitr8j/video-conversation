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
  specialty: string; // Added for the new format
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

// Updated therapist data with actual persona IDs
export const therapists: Therapist[] = [
  {
    id: 'dr-sarah',
    name: 'Dr. Sarah Chen',
    title: 'Licensed Clinical Psychologist',
    specialty: 'CBT & Mindfulness',
    specialties: ['Cognitive Behavioral Therapy', 'Mindfulness', 'Anxiety', 'Depression'],
    description: 'Warm and empathetic approach combining CBT techniques with mindfulness practices for holistic healing.',
    avatar: '👩‍⚕️',
    personaId: 'pa166b1c9398',
    experience: '10+ years',
    approach: 'Cognitive Behavioral Therapy (CBT) & Mindfulness'
  },
  {
    id: 'dr-marcus',
    name: 'Dr. Marcus Williams',
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
    personaId: 'p2fbd605',
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
    personaId: 'pa166b1c9398',
    experience: '7+ years',
    approach: 'Integrative Holistic Therapy'
  },
  {
    id: 'kai',
    name: 'Zen Master Kai',
    title: 'Meditation & Mindfulness Guide',
    specialty: 'Meditation & Zen',
    specialties: ['Meditation', 'Zen Practice', 'Mindfulness', 'Spiritual Guidance'],
    description: 'Ancient wisdom meets modern psychology through meditation and zen practices for inner peace.',
    avatar: '🧘‍♂️',
    personaId: 'pcd46460ac1a',
    experience: '15+ years',
    approach: 'Zen Meditation & Mindfulness'
  },
  {
    id: 'alex',
    name: 'Coach Alex Thunder',
    title: 'Peak Performance Coach',
    specialty: 'Peak Performance',
    specialties: ['Performance Coaching', 'Goal Achievement', 'Motivation', 'Success Mindset'],
    description: 'High-energy coaching focused on unlocking your potential and achieving peak performance in all areas.',
    avatar: '💪',
    personaId: 'p8feaa5df2e2',
    experience: '6+ years',
    approach: 'Performance Psychology & Coaching'
  },
  {
    id: 'sophia',
    name: 'Sophia Wisdom',
    title: 'Life Transition Specialist',
    specialty: 'Life Transitions',
    specialties: ['Life Transitions', 'Career Changes', 'Personal Growth', 'Identity Development'],
    description: 'Guiding individuals through major life changes with wisdom, support, and practical strategies.',
    avatar: '🌟',
    personaId: 'p8dd1938c1da',
    experience: '9+ years',
    approach: 'Narrative Therapy & Life Coaching'
  },
  {
    id: 'james',
    name: 'Dr. James Thompson',
    title: 'Addiction Recovery Specialist',
    specialty: 'Addiction Recovery',
    specialties: ['Addiction Recovery', 'Substance Abuse', 'Behavioral Addictions', 'Relapse Prevention'],
    description: 'Compassionate support for addiction recovery using evidence-based treatments and peer support.',
    avatar: '🧑‍⚕️',
    personaId: 'p1c4d77d9787',
    experience: '11+ years',
    approach: '12-Step & Cognitive Behavioral Therapy'
  },
  {
    id: 'alex-kim',
    name: 'Dr. Alex Kim',
    title: 'LGBTQ+ Affirmative Therapist',
    specialty: 'LGBTQ+ Affirmative',
    specialties: ['LGBTQ+ Issues', 'Gender Identity', 'Sexual Orientation', 'Inclusive Therapy'],
    description: 'Affirming and inclusive therapy for LGBTQ+ individuals and communities with cultural competency.',
    avatar: '🏳️‍🌈',
    personaId: 'pe4057ca48ba',
    experience: '8+ years',
    approach: 'Affirmative & Inclusive Therapy'
  },
  {
    id: 'luna',
    name: 'Luna Starweaver',
    title: 'Art & Creative Therapist',
    specialty: 'Art & Creative Therapy',
    specialties: ['Art Therapy', 'Creative Expression', 'Expressive Arts', 'Creative Healing'],
    description: 'Using creative arts and expression as powerful tools for healing, self-discovery, and growth.',
    avatar: '🎨',
    personaId: 'p8cbf28ba24c',
    experience: '6+ years',
    approach: 'Expressive Arts Therapy'
  },
  {
    id: 'victoria',
    name: 'Victoria Sterling',
    title: 'Career & Executive Coach',
    specialty: 'Career Coaching',
    specialties: ['Career Development', 'Executive Coaching', 'Leadership', 'Professional Growth'],
    description: 'Strategic career coaching and executive development for professional success and fulfillment.',
    avatar: '👩‍💼',
    personaId: 'p3bb4745d4f9',
    experience: '10+ years',
    approach: 'Strategic Career Coaching'
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