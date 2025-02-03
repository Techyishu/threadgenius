import OpenAI from 'openai';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

if (!apiKey) {
  console.error('API Key missing:', apiKey);
  throw new Error('OpenAI API key is not configured in environment variables');
}

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export async function generateTweet(headline: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",

        content: `You are an expert Twitter content creator known for crafting viral, engaging tweets. Your tweets are:
        - Concise and impactful (within Twitter's character limit)
        - Written in a conversational, authentic tone
        - Include relevant hooks to drive engagement
        - Use clear, accessible language
        - Occasionally use emojis where appropriate
        - Focus on providing value to readers
        Do not use hashtags unless specifically requested.`
      },
      {
        role: "user",
        content: `Create an engaging tweet about: ${headline}`
      }
    ],
    temperature: 0.7,
    max_tokens: 280,
  });

  return response.choices[0].message.content?.trim() ?? '';
}

export async function generateThread(headline: string, length: number = 5): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at creating viral Twitter threads. Your threads are:
        - Well-structured with a clear narrative flow
        - Start with a strong hook to capture attention
        - Each tweet builds on the previous one
        - Include specific examples, data, or actionable insights
        - End with a compelling call-to-action or key takeaway
        - Written in a conversational, authentic tone
        - Each tweet should be self-contained but part of the larger narrative
        
        Format the thread as an array of tweets, with each tweet under 280 characters.
        Create a thread of exactly ${length} tweets that provides real value to readers.`
      },
      {
        role: "user",
        content: `Create an engaging thread about: ${headline}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  if (!content) return [];
  
  // Split the content into individual tweets
  return content
    .split('\n')
    .filter(tweet => tweet.trim().length > 0)
    .map(tweet => tweet.replace(/^\d+\.\s*/, '').trim()); // Remove numbering if present
}

export async function generateBio({ intro, niche, whatTheyDo }: {
  intro: string;
  niche: string;
  whatTheyDo: string;
}): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at creating compelling Twitter bios. Your bios are:
        - Concise and impactful (max 160 characters)
        - Highlight unique value propositions
        - Include relevant credentials or achievements
        - Use strong action words
        - Incorporate personality
        - Professional yet approachable
        - Strategic with emoji usage (1-2 max)
        
        Create a bio that captures attention and clearly communicates the person's expertise and value.`
      },
      {
        role: "user",
        content: `Create a Twitter bio for someone with the following details:
        Introduction: ${intro}
        Niche/Expertise: ${niche}
        Current Role/Achievements: ${whatTheyDo}`
      }
    ],
    temperature: 0.7,
    max_tokens: 160,
  });

  return response.choices[0].message.content?.trim() ?? '';
} 