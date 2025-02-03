import Constants from 'expo-constants';

export const ENV = {
  OPENAI_API_KEY: Constants.expoConfig?.extra?.openAiKey
};

// Debug log
console.log('OpenAI API Key loaded:', ENV.OPENAI_API_KEY ? 'Yes' : 'No'); 