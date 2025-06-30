export interface ConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: string;
}

export async function createConversation(
  apiToken: string,
  personaId: string,
  conversationName: string
): Promise<ConversationResponse> {
  if (!apiToken) {
    throw new Error('API token is required');
  }

  if (!personaId) {
    throw new Error('Persona ID is required');
  }

  // Validate persona ID format
  if (personaId.startsWith('REPLACE_WITH_YOUR_PERSONA_ID') || personaId.includes('REPLACE')) {
    throw new Error(`Invalid persona ID: "${personaId}". Please update this with your actual Tavus persona ID from https://platform.tavus.io`);
  }

  const requestBody = {
    persona_id: personaId,
    conversation_name: conversationName || 'Therapy Session'
  };

  console.log('Creating conversation with:', {
    persona_id: personaId,
    conversation_name: conversationName,
    tokenLength: apiToken.length
  });

  try {
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiToken,
      },
      body: JSON.stringify(requestBody),
    });

    // Get response text first to handle both JSON and text responses
    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // If response is not JSON, use the text as error message
        if (responseText) {
          errorMessage = responseText;
        }
      }

      // Add more specific error context based on status code
      switch (response.status) {
        case 400:
          throw new Error(`Bad Request (400): ${errorMessage}. Please check your persona ID "${personaId}" and ensure it exists in your Tavus account.`);
        case 401:
          throw new Error(`Unauthorized (401): ${errorMessage}. Please check your API token in Settings.`);
        case 402:
          throw new Error(`Payment Required (402): ${errorMessage}. Please check your Tavus account credits.`);
        case 403:
          throw new Error(`Forbidden (403): ${errorMessage}. Your API token may not have access to persona "${personaId}".`);
        case 404:
          throw new Error(`Not Found (404): ${errorMessage}. Persona "${personaId}" may not exist or be accessible.`);
        case 429:
          throw new Error(`Rate Limited (429): ${errorMessage}. Please wait and try again.`);
        case 500:
          throw new Error(`Server Error (500): ${errorMessage}. Tavus service may be temporarily unavailable.`);
        default:
          throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
    }

    try {
      const data = JSON.parse(responseText);
      
      if (!data.conversation_id || !data.conversation_url) {
        throw new Error('Invalid response format: missing conversation_id or conversation_url');
      }

      return data;
    } catch (parseError) {
      throw new Error(`Failed to parse response: ${responseText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw our custom errors
      throw error;
    }
    
    // Handle network errors
    throw new Error(`Network error: ${error}. Please check your internet connection.`);
  }
}