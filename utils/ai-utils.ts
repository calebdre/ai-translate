type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
export const extractAndCombineData = (
  responseText: string,
): {role: 'user' | 'assistant' | 'system'; content: string} => {
  const lines = responseText.split('\n');
  let combinedDelta: ChatMessage = {role: 'assistant', content: ''};

  for (const line of lines) {
    if (line.startsWith('data:')) {
      const jsonString = line.substring(5).trim(); // Remove the "data:" prefix

      try {
        const jsonObj = JSON.parse(jsonString);

        // OpenAI
        if (jsonObj.choices && jsonObj.choices[0] && jsonObj.choices[0].delta) {
          const delta = jsonObj.choices[0].delta;

          if (delta.role) {
            combinedDelta.role = delta.role;
          }

          if (delta.content) {
            combinedDelta.content += delta.content;
          }
        }
      } catch (error) {
        // Ignore any parsing errors, such as "data: [DONE]" message
      }
    }
  }

  return combinedDelta;
};
