import { IConversation } from "@/store/conversation";

export const createConversation = async (
  token: string,
  personaId: string,
  customGreeting?: string,
  context?: string
): Promise<IConversation> => {
  const payload = {
    persona_id: personaId,
    custom_greeting: customGreeting || "Hello! I'm here to provide you with a safe, supportive space to talk about whatever is on your mind. How are you feeling today?",
    conversational_context: context || "You are a licensed therapist providing compassionate, professional mental health support. Listen actively, ask thoughtful questions, and provide evidence-based guidance while maintaining appropriate therapeutic boundaries."
  };
  
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};